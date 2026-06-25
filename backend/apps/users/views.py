from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import (
    RegisterSerializer, 
    UserSerializer, 
    ChangePasswordSerializer
)

from django.conf import settings
from django.core.signing import Signer

# Forgot password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from apps.users.models import User
from apps.users.serializers import (
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

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


class ChangePasswordView(APIView):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def post(self, request):
        serialiser = ChangePasswordSerializer(
            data=request.data
        )
        
        serialiser.is_valid(
            raise_exception=True,
        )

        user = request.user

        if not user.check_password(
            serialiser.validated_data['old_password']
        ):
            return Response(
                {
                    'old_password': 'Невірний старий пароль.'
                },
                status=400,
            )
        
        user.set_password(
            serialiser.validated_data['new_password']
        )

        user.save()

        refresh = RefreshToken.for_user(
            user
        )

        return Response(
            {
                'detail': 
                    'Пароль успішно змінено.',
                'access': 
                    str(refresh.access_token),
                'refresh': 
                    str(refresh),
            }
        )
    
class ForgotPasswordView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serializer = (ForgotPasswordSerializer(data=request.data,))

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    'detail':'Якщо такий email існує, лист буде надіслано.'
                }
            )
        
        uid = (
            urlsafe_base64_encode(force_bytes(user.pk))
        )

        token = (
            default_token_generator
                .make_token(user)
        )

        reset_url = (
            f'{settings.FRONTEND_URL}'
            f'/reset-password/'
            f'{uid}/'
            f'{token}/'
        )

        send_mail(
            subject='Відновлення пароля',
            message=(
                'Для відновлення пароля перейдіть за посиланням:\n\n'
                + reset_url
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {
                'default':
                'Якщо такий email існує, лист буде надіслано.'
            }
        )
    
class ResetPasswordView(APIView):
    permission_classes = (
        permissions.AllowAny,
    )

    def post(self, request):
        serializer = (ResetPasswordSerializer(data=request.data))

        serializer.is_valid(
            raise_exception=True,
        )

        print(serializer.validated_data['uid'])
        print(serializer.validated_data['token'])

        try:
            user_id = (
                urlsafe_base64_decode(
                    serializer.validated_data['uid']
                ).decode()
            )

            user = User.objects.get(pk=user_id)
        except(
            User.DoesNotExist,
            ValueError,
            TypeError,
            OverflowError,
        ):
            return Response(
                {
                    'detail': 'Недійсне посилання.'
                },
                status=400,
            )
        
        print(user_id)
        
        if not (
            default_token_generator.check_token(
                user,
                serializer.validated_data['token']
            )
        ):
            return Response(
                {
                    'detail': 'Недійсний або прострочений токен.'
                },
                status=400,
            )
        
        user.set_password(
            serializer.validated_data['new_password']
        )

        user.save()

        return Response(
            {
                'detail': 'Пароль успішно змінено.'
            }
        )