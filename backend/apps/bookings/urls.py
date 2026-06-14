from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.bookings.views import AvailableSlotsView, BookingViewSet, admin_dashboard_view


router = DefaultRouter()

router.register(
    'bookings',
    BookingViewSet,
    basename='bookings',
)


urlpatterns = [
    path('', include(router.urls)),
    path(
        'available-slots/',
        AvailableSlotsView.as_view(),
        name='available-slots',
    ),
    path('admin/dashboard/', admin_dashboard_view,),
]