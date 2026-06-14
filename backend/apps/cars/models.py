from django.conf import settings
from django.db import models

from apps.services.models import CarBodyType

class Car(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cars',
    )
    body_type = models.ForeignKey(
        CarBodyType,
        on_delete=models.PROTECT,
        related_name='cars',
    )
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=20, blank=True)
    color = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['brand', 'model']

    def __str__(self):
        return f'{self.brand} {self.model}'