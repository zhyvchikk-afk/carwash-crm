from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.services.models import (
    CarBodyType,
    Service,
    ServiceCategory,
)
from apps.services.serializers import (
    CarBodyTypeSerializer,
    ServicesCategorySerializer,
    ServiceSerializer,
)


class CarBodyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarBodyType.objects.filter(is_active=True)
    serializer_class = CarBodyTypeSerializer
    permission_classes = (AllowAny,)


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.filter(is_active=True).prefetch_related(
        'services',
        'services__prices',
        'services__prices__body_type',
    )
    serializer_class = ServicesCategorySerializer
    permission_classes = (AllowAny,)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related(
        'category',
    ).prefetch_related(
        'prices',
        'prices__body_type',
    )
    serializer_class = ServiceSerializer
    permission_classes = (AllowAny,)
