from rest_framework import generics

from .models import GalleryImage
from .serializers import GalleryImageSerializer


class GalleryListView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer

    queryset = GalleryImage.objects.all()