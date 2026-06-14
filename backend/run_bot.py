import os
import sys
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from asgiref.sync import sync_to_async
from decouple import config


sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

BOT_TOKEN = config("BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def handle_start(message: types.Message):
    args = message.text.split()

    if len(args) > 1:
        site_user_id = args[1]
        telegram_chat_id = message.chat.id

        @sync_to_async
        def save_telegram_id():
            try:
                user = User.objects.get(id=site_user_id)
                user.telegram_chat_id = str(telegram_chat_id)
                user.save()
                return user
            except User.DoesNotExist:
                return None
            
        user = await save_telegram_id()

        if user:
            await message.answer(
                f'🎉 Привіт, {user.username}!\n'
                f'Ваш акаунт успішно прив\'язано до сайту.\n'
                f'Тепер ви отримуватимете сповіщення про записи на мийку!\n'
            )
        else:
            await message.answer(
                "❌ Помилка: Користувача з таким ID не знайдено на сайті"
            )
    else:
        await message.answer(
            '👋 Привіт! Щоб отримувати сповіщення про записи, будь ласка, '
            'натисніть кнопку "Мийчик" на нашому сайті у вашому особистому кабінеті.'           
        )

async def main():
    print("Бот успішно запущений і слухає сервер...")
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())       