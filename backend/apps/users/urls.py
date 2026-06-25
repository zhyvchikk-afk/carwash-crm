from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import (
    RegisterView, 
    MeView, 
    telegram_link_view,
    ChangePasswordView,   
    ForgotPasswordView,
    ResetPasswordView,
)


urlpatterns = [
    # Створення користувача
    path('register/', RegisterView.as_view(), name='register'),
    # Отримання ДЖВТ токенів
    path(
        'login/', 
        TokenObtainPairView.as_view(), 
        name='token_obtain_pair'
    ),
    # Оновлення аццесс токена
    path(
        'token/refresh/', 
        TokenRefreshView.as_view(), 
        name='token_refresh'
    ),
    # Поточний користувач
    path('me/', MeView.as_view(), name='me'),
    path('telegram-link/', telegram_link_view, name='telegram-link'),
    path(
        'change-password/', 
        ChangePasswordView.as_view(), 
        name='change-password'
    ),
    path(
        'forgot-password/',
        ForgotPasswordView.as_view(),
        name='forgot-password',
    ),
    path(
        'reset-password/',
        ResetPasswordView.as_view(),
        name='reset-password',
    ),
]