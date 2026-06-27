from django.db import models


class GalleryImage(models.Model):
    CATEGORY_CHOICES = (
        ('before', 'До'),
        ('after', 'Після'),
        ('process', 'Процес'),
        ('service', 'Послуги'),
    )

    title = models.CharField(
        max_length=100,
    )
    image = models.ImageField(
        upload_to='gallery/',
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
    )
    description = models.TextField(
        blank=True,
    )
    order = models.PositiveIntegerField(
        default=0,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = (
            'order',
            '-created_at',
        )

    def __str__(self):
        return self.title