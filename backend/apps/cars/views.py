from rest_framework import permissions, viewsets

from apps.cars.models import Car
from apps.cars.serializer import CarSerializer


class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_queryset(self):
        return Car.objects.filter(
            owner=self.request.user,
            is_active=True,
        ).select_related('body_type')
    
    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
        )

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()