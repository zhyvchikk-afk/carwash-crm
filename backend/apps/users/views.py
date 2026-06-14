from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.serializers import RegisterSerializer, UserSerializer

from django.conf import settings
from django.core.signing import Signer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def telegram_link_view(request):
    signer = Signer()

    token = signer.sign(
        str(request.user.id)
    )

    telegram_url = (
        f'https://t.me/'
        f'{settings.BOT_USERNAME}'
        f'?start={token}'
    )

    return Response(
        {
            'connected': (
                request.user.telegram_chat_id
                is not None
            ),
            'telegram_url': telegram_url,
        }
    )



# endpoint для реєстрації
class RegisterView(generics.CreateAPIView ): # Готовий ДРФ-клас для створення об'єкта(автоматично вміє обробляти ПОСТ)
    serializer_class = RegisterSerializer
    # Реєструватися може навіть неавторизований користувач
    permission_classes = (permissions.AllowAny,)

# endpoint для поточного користувача
class MeView(APIView):
    permission_classes = (permissions.IsAuthenticated,) # Доступ лише для залогінених

    def get(self, request): # Повертає дані профілю
        serializer = UserSerializer(request.user) # Корситувач якого Джанго визначив по ДЖВТ токену

        return Response(serializer.data)
    
    
    def patch(self, request): # Частково оновлює профіль
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
