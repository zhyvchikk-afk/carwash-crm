from django.db import models

# (Зовнішня мийка, Салон, Детейлінг)
class ServiceCategory(models.Model):
    title = models.CharField(max_length=255,unique=True,)
    slug = models.SlugField(unique=True,)
    image = models.ImageField(
        upload_to='services/categories/',
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True,)
    created_at = models.DateTimeField(auto_now_add=True,)

    class Meta:
        ordering = ['title']
        verbose_name = 'Service category'
        verbose_name_plural = 'Service categories'

    def __str__(self):
        return self.title
    


# (Седан, Універсал тощо)
class CarBodyType(models.Model):
    title = models.CharField(max_length=100,unique=True,)
    slug = models.SlugField(unique=True,)
    is_active = models.BooleanField(default=True,)

    class Meta:
        ordering = ['title']
        verbose_name = 'Car body type'
        verbose_name_plural = 'Car body types'

    def __str__(self):
        return self.title
    


# (Експрес мийка, Хімчистка салону тощо)
class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name='services',
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
    

# Таблиця цін яка поєднує послугу і тип кузова і говорить його ціну
class ServicePrice(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='prices',
    )
    body_type = models.ForeignKey(
        CarBodyType,
        on_delete=models.CASCADE,
        related_name='service_prices',
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    class Meta:
        # Забороняє створити дві ціни для однієї пари
        unique_together = (
            'service',
            'body_type',
        )

        ordering = [
            'service',
            'body_type',
        ]

        verbose_name = 'Service price'     
        verbose_name_plural = 'Service prices'     

    def __str__(self):
        return f'{self.service.title} / {self.body_type.title} - {self.price}'
    