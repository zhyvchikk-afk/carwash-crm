import os
import sys
from datetime import datetime, timedelta

import django


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


from apps.bookings.models import Booking
from apps.telegram.bot import send_telegram_sync


def send_reminders():
    now = datetime.now()

    bookings = Booking.objects.filter(
        status=Booking.Status.CONFIRMED,
        reminder_sent=False,
    )

    for booking in bookings:
        bookings_datetime = datetime.combine(
            booking.date,
            booking.start_time,
        )

        delta = bookings_datetime - now

        if timedelta(
            hours=1,
            minutes=55,    
        ) <= delta <= timedelta(
            hours=2,
            minutes=5,
        ):
            if booking.user.telegram_chat_id:
                message = (
                    "🔔 Нагадування!\n\n"
                    "Через 2 години ми чекаємо Вас на автомийці.\n\n"
                    f"📅 Дата: {booking.date}\n"
                    f"🕒 Час: "
                    f"{booking.start_time} - "
                    f"{booking.end_time}\n"
                    f"🚗 Авто: "
                    f"{booking.car.brand} "
                    f"{booking.car.model}\n\n"
                    "До зустрічі! 🚗✨"
                )

                send_telegram_sync(
                    booking.user.telegram_chat_id,
                    message,
                )

                booking.reminder_sent = True
                booking.save(
                    update_fields=['reminder_sent',]
                )

                print(
                    f'Reminder sent for booking #{booking.id}'
                )


if __name__ == '__main__':
    send_reminders()