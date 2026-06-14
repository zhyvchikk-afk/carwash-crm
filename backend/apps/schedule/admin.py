from django.contrib import admin

from apps.schedule.models import DayOff, WorkingDay


@admin.register(WorkingDay)
class WorkingDayAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'weekday',
        'start_time',
        'end_time',
        'is_active',
    )
    list_filter = (
        'is_active',
    )


@admin.register(DayOff)
class DayOffAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'date',
        'reason',
    )
    search_fields = (
        'reason',
    )