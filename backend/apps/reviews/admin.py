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
        'replied_at',
    )

    fields = (
        'user',
        'booking',
        'rating',
        'text',
        'admin_reply',
        'is_published',
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
