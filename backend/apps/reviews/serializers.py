from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True,
    )

    admin_reply = serializers.CharField(
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
            'replied_at',
            'admin_reply',
        )


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review

        fields = (
            'rating',
            'text',
        )