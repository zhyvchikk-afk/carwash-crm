from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.cars.views import CarViewSet


router = DefaultRouter()

router.register(
    'cars',
    CarViewSet,
    basename='cars',
)


urlpatterns = [
    path('', include(router.urls)),
]