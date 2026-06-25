from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True,
    )

    class Meta:
        model = Review

        fields = (
            'id',
            'username',
            'rating',
            'text',
            'created_at',
        )


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review

        fields = (
            'rating',
            'text',
        )