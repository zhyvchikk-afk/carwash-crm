from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.services.views import (
    CarBodyTypeViewSet,
    ServiceCategoryViewSet,
    ServiceViewSet,
)


router = DefaultRouter()

router.register(
    'body-types',
    CarBodyTypeViewSet,
    basename='body-types',
)

router.register(
    'categories',
    ServiceCategoryViewSet,
    basename='categories',
)

router.register(
    'services',
    ServiceViewSet,
    basename='services',
)


urlpatterns = [
    path('', include(router.urls)),
]