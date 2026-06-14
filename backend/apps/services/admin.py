from django.contrib import admin

from apps.services.models import (
    CarBodyType,
    Service,
    ServiceCategory,
    ServicePrice,
)


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'slug',
        'is_active',
    )

    prepopulated_fields = {
        'slug': ('title',),
    }


@admin.register(CarBodyType)
class CarBodyTypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'slug',
        'is_active',
    )

    prepopulated_fields = {
        'slug': ('title',),
    }


class ServicePriceInline(admin.TabularInline):
    model = ServicePrice
    extra = 1


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'category',
        'duration_minutes',
        'is_active',
    )

    list_filter = (
        'category',
        'is_active',
    )

    search_fields = (
        'title',
        'description',
    )

    prepopulated_fields = {
        'slug': ('title',),
    }

    inlines = (
        ServicePriceInline,
    )


@admin.register(ServicePrice)
class ServicePriceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'service',
        'body_type',
        'price',
    )

    list_filter = (
        'service',
        'body_type',
    )