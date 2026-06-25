from django.urls import path

from apps.core.views import (
    PublicStatsView,
)

urlpatterns = [
    path(
        'public/stats/',
        PublicStatsView.as_view(),
        name='public-stats',
    ),
]