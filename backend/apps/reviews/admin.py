from django.contrib import admin

from apps.reviews.models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'rating',
        'is_published',
        'created_at',
    )

    list_filter = (
        'rating',
        'is_published',
    )

    search_fields = (
        'user__username',
        'text',
    )

    readonly_fields = (
        'created_at',
    )
