from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    # Усі юрлс з аппс.юзерс.юрлс.пай будуть починатися з "апі/аутх/"
    path('api/auth/', include('apps.users.urls')),
    path('api/', include('apps.services.urls')),
    path('api/', include('apps.cars.urls')),
    path('api/', include('apps.bookings.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
