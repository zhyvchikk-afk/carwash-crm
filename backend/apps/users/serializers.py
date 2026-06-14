from rest_framework import serializers # "Перекладач" між БД і Джанго
from apps.users.models import User # Імпорт моделі користувача
import re

class UserSerializer(serializers.ModelSerializer):
    #Налаштування серіалізера
    class Meta:
        #Модель з якою працює
        model = User
        #Поля які віддає в JSON
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'phone',
            'email',
            'role',
            'avatar',
            'telegram_chat_id',
            'created_at',
            'updated_at',
        )

        # Поля тільки для читання(безпека)
        read_only_fields = (
            'id',
            'role',
            'created_at',
            'updated_at',
        )

# Серіалізер реєстрації
class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        required=True,
        allow_blank=False,
    )
    password = serializers.CharField(
        write_only=True, # Сервер ніколи не поверне пароль в Джейсон
        min_length=8,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'phone',
            'email',
            'password',
            'password_confirm',
        )

    # Загальна перевірка
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Password do not match.'}
            )
        
        return attrs
    
    def validate_phone(self, value):
        phone = re.sub(r'\D', '', value)

        if phone.startswith('380'):
            phone = '+' + phone
        elif phone.startswith('0'):
            phone = '+38' + phone
        else:
            raise serializers.ValidationError(
                'Невірний формат номера телефону.'
            )
        
        if len(phone) != 13:
            raise serializers.ValidationError(
                'Номер повинен містити 10 цифр.'
            )
        
        return phone
    
    # Створення користувача
    def create(self, validated_data):
        # Видаляємо це поле бо в моделі Юзер такого поля немає
        validated_data.pop('password_confirm')

        # Дістаємо окремо пароль
        password = validated_data.pop('password')

        # Створюємо об'єкт Юзер з решти данних
        user = User(**validated_data)
        # Не зберігаємо як текст. Джанго перетворює пароль в хеш
        user.set_password(password)
        user.save()

        return user