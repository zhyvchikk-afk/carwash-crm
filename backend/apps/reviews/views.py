from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from django.utils import timezone

from .models import Review
from .serializers import (
    ReviewSerializer,
    CreateReviewSerializer,
)
from apps.bookings.models import Booking


class PublicReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return (
            Review.objects.filter(
                is_published=True
            )
            [:6]
        )
    

class CreateReviewView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )
    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                pk=booking_id,
                user=request.user,
            )
        except Booking.DoesNotExist:
            return Response(
                {
                    'detail': 'Запис не знайдено.'
                },
                status=404,
            )
        
        if booking.status != 'completed':
            return Response(
                {
                    'detail': 'Можна оцінювати лише виконані записи.'
                },
                status=404,
            )
        
        if hasattr(booking, 'review'):
            return Response(
                {
                    'detail': 'Відгук вже залишено.'
                },
                status=404,
            )
        
        serializer = (
            CreateReviewSerializer(data=request.data)
        )

        serializer.is_valid(raise_exception=True)

        Review.objects.create(
            user=request.user,
            booking=booking,
            rating=serializer.validated_data['rating'],
            text=serializer.validated_data['text'],
        )

        return Response(
            {
                'detail': 'Відгук успішно додано.'
            }
        )
    

class AdminReplyReviewView(APIView):
    permission_classes = (
        permissions.IsAdminUser,
    )

    def patch(self, request, review_id):
        try:
            review = Review.objects.get(pk=review_id)
        except Review.DoesNotExist:
            return Response(
                {
                    'detail': 'Відгук не знайдено.'
                },
                status=404,
            )
        
        admin_reply = request.data.get('admin_reply')

        if not admin_reply:
            return Response(
                {
                    'detail': 'Відповідь не може бути порожньою.'
                },
                status=404,
            )
        
        review.admin_reply = admin_reply
        review.replied_at = timezone.now()

        review.save()

        return Response(
            {
                'detail': 'Відповідь успішно додана.'
            }
        )
    
class AdminReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (
        permissions.IsAdminUser,
    )

    queryset = (
        Review.objects
        .select_related('user')
        .order_by('-created_at')
    )