from django.db import models
from django.utils import timezone

from apps.users.models import User
from apps.bookings.models import Booking


class Review(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='reviews',
    )
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='review',
    )
    rating = models.PositiveSmallIntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    is_published = models.BooleanField(
        default=True,
    )

    admin_reply = models.CharField(
        blank=True,
    )
    replied_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    def save(self, *args, **kwargs):
        if self.admin_reply and not self.replied_at:
            self.replied_at = timezone.now()

        super().save(*args, **kwargs)

    class Meta:
        ordering = (
            '-created_at',
        )

    def __str__(self):
        return (
            f'{self.user.username} '
            f'({self.rating}⭐)'
        )