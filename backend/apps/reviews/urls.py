from django.urls import path

from .views import (
    PublicReviewsView,
    CreateReviewView,
)


urlpatterns = [
    path(
        'reviews/',
        PublicReviewsView.as_view(),
        name='public-reviews',
    ),
    path(
        'bookings/<int:booking_id>/review/',
        CreateReviewView.as_view(),
        name='create-reviews',
    ),
]