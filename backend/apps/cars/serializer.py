from rest_framework import serializers

from apps.cars.models import Car
from apps.services.serializers import CarBodyTypeSerializer


class CarSerializer(serializers.ModelSerializer):
    body_type_detail = CarBodyTypeSerializer(
        source='body_type',
        read_only=True,
    )

    class Meta:
        model = Car
        fields = (
            'id',
            'body_type',
            'body_type_detail',
            'brand',
            'model',
            'plate_number',
            'color',
            'is_active',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'is_active',
            'created_at',
            'apdated_at',
        )