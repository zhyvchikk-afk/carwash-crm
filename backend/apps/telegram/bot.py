import asyncio
import os
import sys

import django

from asgiref.sync import sync_to_async


sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )
    )
)

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings',
)

django.setup()


from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message

from django.conf import settings

from apps.users.models import User


bot = Bot(token=settings.BOT_TOKEN)

dp = Dispatcher()


async def send_telegram_message(chat_id, text):
    bot = Bot(token=settings.BOT_TOKEN)
    try:
        await bot.send_message(chat_id=chat_id, text=text)
    except Exception as error:
        print(
            f'Telegram error: {error}'
        )
    finally:
        await bot.session.close()

def send_telegram_sync(chat_id, text):
    asyncio.run(send_telegram_message(chat_id, text))

@dp.message(CommandStart())
async def start_handler(message: Message):
    print("TEXT:", message.text)
    print("ARGS:", message.text.split(maxsplit=1))

    args = message.text.split(maxsplit=1)

    if len(args) == 1:
        await message.answer(
            '🚗 Для підключення Telegram '
            'перейдіть у бот із сайту.'
        )
        return
    
    user_id = args[1]

    try:
        user = await sync_to_async(User.objects.get)(id=user_id)

        if user.telegram_chat_id:
            await message.answer(
                '✅ Телеграм уже підключено до Вашого акаунта.'
            )
        else:
            user.telegram_chat_id = message.from_user.id
            await sync_to_async(user.save)(
                update_fields=['telegram_chat_id',]
            )

            await message.answer(
                '✅ Telegram успішно '
                'підключено!'
            )
    except User.DoesNotExist:
        await message.answer(
            '❌ Користувача не знайдено.'
        )


async def main():
    print(
        'Started...'
    )

    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())