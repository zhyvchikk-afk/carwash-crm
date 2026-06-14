from datetime import datetime, timedelta
from django.db.models import Sum, Avg, Count, Q
from django.db.models.functions import TruncMonth, TruncDay
from django.utils.timezone import now

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view
from rest_framework.filters import SearchFilter

from apps.bookings.models import Booking
from apps.bookings.serializers import BookingSerializer
from apps.schedule.models import DayOff, WorkingDay
from apps.services.models import Service
from apps.cars.models import Car
from apps.users.models import User
from apps.telegram.bot import (
    send_telegram_sync, send_telegram_message
)
from asgiref.sync import sync_to_async, async_to_sync


@api_view(['GET'])
def admin_dashboard_view(request):
    user = request.user

    if not (
        user.Role in [
            User.Role.ADMIN,
            User.Role.MANAGER,
        ]
        or user.is_staff
    ):
        return Response(
            {
                'detail': 'Ви не стаф.'
            },
            status=status.HTTP_403_FORBIDDEN,
        )
    
    today = now().date()

    current_month = today.month
    current_year = today.year

    bookings_today = Booking.objects.filter(
        date=today,
    ).count()

    pending_bookings = Booking.objects.filter(
        status=Booking.Status.PENDING,
    ).count()

    confirmed_bookings = Booking.objects.filter(
        status=Booking.Status.CONFIRMED,
    ).count()

    cancelled_bookings = Booking.objects.filter(
        status=Booking.Status.CANCELLED,
    ).count()

    completed_bookings = Booking.objects.filter(
        status=Booking.Status.COMPLETED,
    ).count()

    total_clients = User.objects.filter(
        role=User.Role.CLIENT,
    ).count()

    total_cars = Car.objects.count()

    total_earnings = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
        ).aggregate(
            total=Sum('price'),
        )['total']
        or 0
    )

    today_income = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
            date=today,
        ).aggregate(
            total=Sum('price'),
        )['total']
        or 0
    )

    month_income = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
            date__year=current_year,
            date__month=current_month,
        ).aggregate(
            total=Sum('price'),
        )['total']
        or 0
    )

    today_completed = Booking.objects.filter(
        status=Booking.Status.COMPLETED,
        date=today,
    ).count()

    average_check = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
        ).aggregate(
            avg=Avg('price'),
        )['avg']
        or 0
    )

    top_services = (
        Service.objects
        .annotate(
            bookings_count=Count('bookings')
        )
        .order_by(
            '-bookings_count',
            'title',
        )[:5]
    )

    top_clients = (
        User.objects.filter(
            role=User.Role.CLIENT,
        )
        .annotate(
            bookings_count=Count(
                'bookings'
            ),
            total_spent=Sum(
                'bookings__price',
                filter=Q(
                    bookings__status=Booking.Status.COMPLETED,
                ),
            ),
        )
        .order_by(
            '-total_spent',
            '-bookings_count',
        )[:5]
    )

    week_start = today - timedelta(days=6)

    weekly_revenue = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
            date__gte=week_start,
        )
        .annotate(
            day=TruncDay('date')
        )
        .values('day')
        .annotate(
            revenue=Sum('price')
        )
        .order_by('day')
    )

    month_start = today - timedelta(days=29)

    monthly_revenue = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
            date__gte=month_start,
        )
        .annotate(
            day=TruncDay('date')
        )
        .values('day')
        .annotate(
            revenue=Sum('price')
        )
        .order_by('day')
    )

    yearly_revenue = (
        Booking.objects.filter(
            status=Booking.Status.COMPLETED,
            date__year=today.year,
        )
        .annotate(
            month=TruncMonth('date')
        )
        .values('month')
        .annotate(
            revenue=Sum('price')
        )
        .order_by('month')
    )

    recent_bookings = (
        Booking.objects.select_related(
            'user',
        ).prefetch_related(
            'services',
        )
        .order_by('-created_at')[:10]
    )

    recent_bookings_data = []

    for booking in recent_bookings:
        recent_bookings_data.append(
            {
                'id': booking.id,
                'client': booking.user.username,
                'service': ', '.join(
                    service.title
                    for service in booking.services.all()
                ),
                'date': booking.date,
                'status': booking.status,
                'price': str(booking.price),
            }
        )

    return Response(
        {
            'bookings_today': bookings_today,
            'pending_bookings': pending_bookings,
            'confirmed_bookings': confirmed_bookings,
            'cancelled_bookings': cancelled_bookings,
            'completed_bookings': completed_bookings,
            'total_clients': total_clients,
            'total_cars': total_cars,
            'total_earnings': total_earnings,
            'top_clients': [
                {
                    'username': client.username,
                    'bookings_count': client.bookings_count,
                    'total_spent': str(client.total_spent or 0),
                }
                for client in top_clients
            ],

            'today_income': today_income,
            'month_income': month_income,
            'today_completed': today_completed,
            'average_check': round(
                average_check,
                2,
            ),
            
            'weekly_revenue': [
                {
                    'label': item['day'].strftime(
                        '%d.%m'
                    ),
                    'revenue': item['revenue'],
                }
                for item in weekly_revenue
            ],
            'monthly_revenue': [
                {
                    'label': item['day'].strftime(
                        '%d.%m'
                    ),
                    'revenue': item['revenue'],
                }
                for item in monthly_revenue
            ],
            'yearly_revenue': [
                {
                    'label': item['month'].strftime(
                        '%b'
                    ),
                    'revenue': item['revenue'],
                }
                for item in yearly_revenue
            ],

            'recent_bookings': recent_bookings_data,

            'top_services': [
                {
                    'title': service.title,
                    'count': service.bookings_count,
                }
                for service in top_services
            ],
        }
    )




class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [SearchFilter]

    search_fields = [
        'car__brand',
        'car__model',
        'car__plate_number',
        'user__username',
    ]

    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff or user.is_superuser:
            return Booking.objects.all()
        return (
            Booking.objects
            .filter(user=user,)
            .select_related(
                'user',
                'car',
            )
            .prefetch_related(
                'services',
            )
        )
            

    def perform_create(self, serializer):
        serializer.validated_data.pop('user', None)
        
        booking = serializer.save(
            user=self.request.user
        )

        admin = User.objects.filter(
            role=User.Role.ADMIN,
            telegram_chat_id__isnull=False,
        ).first()

        if admin:
            message = (
                "🆕 Новий запис!\n\n"
                f"👤 Клієнт: {booking.user.username}\n"
                f"🚗 Авто: "
                f"{booking.car.brand}"
                f"{booking.car.model}\n"
                f"📅 Дата: {booking.date}\n"
                f"🕒 Час: "
                f"{booking.start_time} - "
                f"{booking.end_time}"
            )

            async_to_sync(
                send_telegram_message
            )(
                admin.telegram_chat_id,
                message,
            )

        if booking.user.telegram_chat_id:
            message = (
                "🆕 Ваш запис успішно створено!\n\n"
                f"📅 Дата: {booking.date}\n"
                f"🕒 Час: {booking.start_time} - {booking.end_time}\n"
                f"🚗 Авто: {booking.car.brand} {booking.car.model}\n\n"
                "⏳ Очікуйте на підтвердження адміністратором."
            )

            send_telegram_sync(
                booking.user.telegram_chat_id,
                message,
            )



    
    def perform_destroy(self, instance):
        instance.status = Booking.Status.CANCELLED
        instance.save()

    @action(
        detail=True,
        methods=['patch'],
        url_path='change-status',
    )
    def change_status(self, request, pk=None):
        user = request.user

        if not (user.role in ['admin', 'manager'] or user.is_staff):
            return Response(
                {'detail': 'You do not have permission to change booking status.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        booking = self.get_object()
        new_status = request.data.get('status')

        allowed_statuses = [
            Booking.Status.PENDING,
            Booking.Status.CONFIRMED,
            Booking.Status.CANCELLED,
            Booking.Status.COMPLETED,
        ]

        if new_status not in allowed_statuses:
            return Response(
                {'status': 'Invalid status.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        booking.status = new_status
        booking.save()

        if booking.user.telegram_chat_id:
            if booking.status == Booking.Status.CONFIRMED:
                message = (
                    "✅ Ваш запис підтверджено!\n\n"
                    f"📅 Дата: {booking.date}\n"
                    f"🕒 Час:\n"
                    f"{booking.start_time} - "
                    f"{booking.end_time}\n\n"
                    "Чекаємо Вас на автомийці! 🚗\n"
                )
            elif booking.status == Booking.Status.CANCELLED:
                message = (
                    "❌ Ваш запис було скасовано.\n\n"
                    f"📅 Дата: {booking.date}\n"
                    f"🕒 Час: "
                    f"{booking.start_time} - "
                    f"{booking.end_time}\n\n"
                    "Для уточнення деталей "
                    "зв'яжіться з адміністратором."
                )
            elif booking.status == Booking.Status.COMPLETED:
                message = (
                    "🎉 Ваш запис успішно завершено!\n\n"
                    "Дякуємо, що обрали нашу автомийку! 🚗✨"
                )
            else:
                message = None

            if message:
                send_telegram_sync(
                    booking.user.telegram_chat_id,
                    message,
                )

        serializer = self.get_serializer(booking)

        return Response(serializer.data)
    

    @action(
        detail=False,
        methods=['get'],
        url_path='admin-list',
    )
    def admin_list(self, request):
        user = request.user

        if not (
            user.role in ['admin', 'manager']
            or user.is_staff
        ):
            return Response(
                {
                    'detail': (
                        "Ви не маєте доступу до перегляду усіх записів"
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        
        queryset = (
            Booking.objects
            .select_related(
                'user',
                'car',
            )
            .prefetch_related(
                'services',
            )
            .order_by(
                '-date',
                '-start_time',
            )
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

    
class AvailableSlotsView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        date_value = request.query_params.get('date')
        services_param = request.query_params.get('services')

        if not date_value or not services_param:
            return Response(
                {'detail': 'date and services are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            selected_date = datetime.strptime(
                date_value,
                '%Y-%m-%d',
            ).date()
        except ValueError:
            return Response(
                {'detail': 'date must be in DD-MM-YYYY format.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            service_ids = [
                int(service_id)
                for service_id in services_param.split(',')
            ]
        except ValueError:
            return Response(
                {
                    'detail':
                    'Invalid services format.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        services = Service.objects.filter(
            id__in=service_ids,
            is_active=True,
        )

        if services.count() != len(service_ids):
            return Response(
                {
                    'detail':
                    'One or more services not found.'
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        
        total_duration = sum(
            service.duration_minutes
            for service in services
        )
        

        if DayOff.objects.filter(date=selected_date).exists():
            return Response(
                {
                    'date': selected_date,
                    'slots': [],
                }
            )
        
        weekday = selected_date.weekday()

        try:
            working_day = WorkingDay.objects.get(
                weekday=weekday,
                is_active=True,
            )
        except WorkingDay.DoesNotExist:
            return Response(
                {
                    'date': selected_date,
                    'slots': [],
                }
            )
        

        start_datetime = datetime.combine(
            selected_date,
            working_day.start_time,
        )
        end_datetime = datetime.combine(
            selected_date,
            working_day.end_time,
        )

        busy_bookings = Booking.objects.filter(
            date=selected_date,
            status__in=[
                Booking.Status.PENDING,
                Booking.Status.CONFIRMED,
            ],
        )

        slots = []
        current_datetime = start_datetime

        while current_datetime + timedelta(minutes=total_duration) < end_datetime:
            current_time = current_datetime.time()
            slot_end_datetime = current_datetime + timedelta(
                minutes=total_duration,
            )
            slot_end_time = slot_end_datetime.time()

            is_busy = busy_bookings.filter(
                start_time__lt=slot_end_time,
                end_time__gt=current_time,
            ).exists()

            if not is_busy:
                slots.append(
                    {
                        'start_time': current_time.strftime('%H:%M'),
                        'end_time': slot_end_time.strftime('%H:%M'),
                    }
                )

            current_datetime += timedelta(minutes=30)

        return Response(
            {
                'date': selected_date,
                'services': [
                    service.title for service in services
                ],
                'duration_minutes': total_duration,
                'slots': slots,
            }
        )
    

