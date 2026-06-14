from django.contrib import admin

from apps.cars.models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'owner',
        'brand',
        'model',
        'body_type',
        'plate_number',
        'is_active',
    )
    list_filter = (
        'body_type',
        'is_active',
    )
    search_fields = (
        'brand',
        'model',
        'plate_number',
        'owner_username',
        'owner_phone',
    )
