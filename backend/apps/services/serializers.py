from rest_framework import serializers

from apps.services.models import (
    CarBodyType,
    Service,
    ServiceCategory,
    ServicePrice,
)


class CarBodyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBodyType
        fields = (
            'id',
            'title',
            'slug',
        )

class ServicePriceSerializer(serializers.ModelSerializer):
    body_type = CarBodyTypeSerializer(read_only=True)

    class Meta:
        model = ServicePrice
        fields = (
            'id',
            'body_type',
            'price',
        )

class ServiceSerializer(serializers.ModelSerializer):
    prices = ServicePriceSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = (
            'id',
            'category',
            'title',
            'slug',
            'description',
            'duration_minutes',
            'image',
            'prices',
        )

class ServicesCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = (
            'id',
            'title',
            'slug',
            'image',
            'services',
        )