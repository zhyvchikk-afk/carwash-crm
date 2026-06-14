from django.contrib import admin

from apps.bookings.models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'car',
        'date',
        'start_time',
        'end_time',
        'price',
        'status',
    )
    list_filter = (
        'status',
        'date',
    )
    search_fields = (
        'user__username',
        'user__phone',
        'car__brand',
        'car__model',
        'car__plate_number',
    )