from django.contrib import admin

from .models import GalleryImage


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'order',
    )

    list_editable = (
        'order',
    )

    list_filter = (
        'category',
    )