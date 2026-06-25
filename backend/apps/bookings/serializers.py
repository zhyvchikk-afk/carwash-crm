from datetime import datetime, timedelta

from rest_framework import serializers

from apps.bookings.models import Booking
from apps.cars.models import Car
from apps.services.models import Service, ServicePrice
from apps.schedule.models import DayOff, WorkingDay

from apps.cars.serializer import CarSerializer
from apps.services.serializers import ServiceSerializer


class BookingSerializer(serializers.ModelSerializer):
    car_detail = CarSerializer(
        source='car',
        read_only=True,
    )

    services = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        many=True,
    )

    service_details = ServiceSerializer(
        source='services',
        many=True,
        read_only=True,
    )
    user_username = serializers.CharField(
        source='user.username',
        read_only=True,
    )
    user_phone = serializers.CharField(
        source='user.phone',
        read_only=True,
    )
    has_review = serializers.SerializerMethodField()



    class Meta:
        model = Booking
        fields = (
            'id',
            'user_username',
            'user_phone',
            'car',
            'car_detail',
            'services',
            'service_details',
            'date',
            'start_time',
            'end_time',
            'duration_minutes',
            'price',
            'status',
            'comment',
            'created_at',
            'updated_at',
            'has_review',
        )
        read_only_fields = (
            'id',
            'end_time',
            'duration_minutes',
            'price',
            'status',
            'created_at',
            'updated_at',
        )

    def validate(self, attrs):
        request = self.context['request']

        car = attrs['car']
        services = attrs['services']
        date = attrs['date']
        start_time = attrs['start_time']
        total_duration = 0

        for service in services:
            total_duration += (
                service.duration_minutes
            )

        total_price = 0

        for service in services:
            try:
                service_price = (
                    ServicePrice.objects.get(
                        service=service,
                        body_type=car.body_type,
                    )
                )
            except ServicePrice.DoesNotExist:
                raise serializers.ValidationError(
                    {
                        'services':
                        (
                            'Price for this body type '
                            'does not exist.'
                        )
                    }
                )
            
            total_price += service_price.price


        if car.owner != request.user:
            raise serializers.ValidationError(
                {'car': 'You can use only your own car.'}
            )
        
        
        start_datetime = datetime.combine(date, start_time)
        end_datetime = start_datetime + timedelta(
            minutes=total_duration,
        )

        if DayOff.objects.filter(date=date).exists():
            raise serializers.ValidationError(
                {
                    'date': 'This day is day off.'
                }
            )
        
        weekday = date.weekday()

        try:
            working_day = WorkingDay.objects.get(
                weekday=weekday,
                is_active=True,
            )
        except WorkingDay.DoesNotExist:
            raise serializers.ValidationError(
                {
                    'date': 'Car wash does not work this day.'
                }
            )
        
        if start_time < working_day.start_time:
            raise serializers.ValidationError(
                {
                    'start_time': 'Booking cannot start befor working hours.'
                }
            )
        
        if end_datetime.time() > working_day.end_time:
            raise serializers.ValidationError(
                {
                    'start_time': 'Booking cannot end after working hours.'
                }
            )

        is_busy = Booking.objects.filter(
            date=date,
            status__in=[
                Booking.Status.PENDING,
                Booking.Status.CONFIRMED,
            ],
            start_time__lt=end_datetime.time(),
            end_time__gt=start_time,
        ).exists()

        if is_busy:
            raise serializers.ValidationError(
                {
                    'statr_time': 'This time slot is already booked.'
                }
            )

        attrs['price'] = total_price
        attrs['duration_minutes'] = (
            total_duration
        )
        attrs['end_time'] = (
            end_datetime.time()
        )

        return attrs
    
    def create(self, validated_data):
        services = validated_data.pop(
            'services'
        )

        booking = Booking.objects.create(
            **validated_data,
        )

        booking.services.set(
            services
        )

        return booking
    
    def get_has_review(self, obj):
        return hasattr(obj, 'review')
    

class RescheduleBookingSerializer(serializers.Serializer):
    date = serializers.DateField()
    start_time = serializers.TimeField()