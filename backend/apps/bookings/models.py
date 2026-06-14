from django.conf import settings
from django.db import models

from apps.cars.models import Car
from apps.services.models import Service, ServicePrice


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.PROTECT,
        related_name='bookings',
    )
    services = models.ManyToManyField(
        Service,
        related_name='bookings',
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reminder_sent = models.BooleanField(
        default=False,
    )

    @property
    def total_duration(self):
        return sum(
            service.duration_minutes
            for service in self.services.all()
        )
    
    @property
    def total_price(self):
        return self.price

    class Meta:
        ordering = ['-date', '-start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['date', 'start_time'],
                condition=models.Q(status__in=['pending', 'confirmed']),
                name='unique_active_booking_slot',
            )
        ]

    def __str__(self):
        services_titles = ', '.join([service.title for service in self.services.all()])
        return f'{self.user.username} - [{services_titles}] - {self.date} {self.start_time}'