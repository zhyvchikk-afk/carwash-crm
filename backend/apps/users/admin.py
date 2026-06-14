from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'id',
        'username',
        'email',
        'phone',
        'role',
        'is_staff',
        'is_active',
    )

    list_filter = (
        'role',
        'is_staff',
        'is_active',
    )

    search_fields = (
        'username',
        'email',
        'phone',
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            'Additional info',
            {
                'fields': (
                    'phone',
                    'role',
                    'avatar',
                    'telegram_chat_id',
                )
            },
        ),
    )
