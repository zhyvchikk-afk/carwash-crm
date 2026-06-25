from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CLIENT = 'client', 'Client'
        MANAGER = 'manager', 'Manager'
        ADMIN = 'admin', 'Admin'

    email = models.EmailField(
        unique=True,
    )
    phone = models.CharField(
        max_length=20,
        unique=True,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
    )

    avatar = models.ImageField(
        upload_to='users/avatars/',
        blank=True,
        null=True,
    )

    telegram_chat_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    REQUIRED_FIELDS = []

    def __str__(self):
        return f'{self.username} ({self.role})'
