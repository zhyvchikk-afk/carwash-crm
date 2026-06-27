from django.urls import path

from .views import (
    PublicReviewsView,
    CreateReviewView,
    AdminReplyReviewView,
    AdminReviewsView,
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
    path(
        'reviews/<int:review_id>/reply/',
        AdminReplyReviewView.as_view(),
    ),
    path(
        'admin/reviews/',
        AdminReviewsView.as_view(),
    ),
]