from rest_framework.views import APIView
from rest_framework.response import Response

from apps.bookings.models import Booking
from apps.users.models import User


class PublicStatsView(APIView):
    permission_classes = []

    def get(self, request):
        completed_bookings = (
            Booking.objects.filter(
                status='completed'
            ).count()
        )

        clients = (
            User.objects.filter(
                role='client'
            ).count()
        )

        return Response(
            {
                'completed_bookings':
                    1832 + completed_bookings,
                'clients':
                    349 + clients,
                'services':
                    10,
                'rating':
                4.9,
            }
        )