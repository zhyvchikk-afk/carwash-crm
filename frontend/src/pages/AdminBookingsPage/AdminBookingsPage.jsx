import { useEffect, useState } from "react";

import api from '../../api/axios'

import styles from './AdminBookingsPage.module.css'


function AdminBookingsPage() {
    const [bookings, setBookings] = useState([])
    const [error, setError] = useState('')

    async function loadBookings() {
        try {
            const response = await api.get('/bookings/admin-list/')
            setBookings(response.data)
        } catch (error) {
            setError('Не вдалося завантажити записи')
        }
    }

    useEffect(() => {
        loadBookings()
    }, [])

    async function handleStatusChange(bookingId, status) {
        try {
            await api.patch(
                `/bookings/${bookingId}/change-status/`,
                {
                    status: status,
                },
            )

            await loadBookings()
        } catch (error) {
            setError('Не вдалося змінити статус')
        }
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>
                Керування записами
            </h1>

            {error && (
                <p className={styles.error}>{error}</p>
            )}

            <div className={styles.list}>
                {bookings.map((booking) => (
                    <article
                        key={booking.id}
                        className={styles.card}
                    >
                        <div className={styles.content}>
                            <h3 className={styles.services}>
                                {booking.service_detail?.title}
                            </h3>

                            <p>Клієнт: {booking.user_username}</p>
                            <p>
                                Авто:
                                {' '}
                                {booking.car_detail?.brand}
                                {' '}
                                {booking.car_detail?.model}
                            </p>

                            <p>
                                Дата: {booking.date}
                            </p>

                            <p>
                                Час:
                                {' '}
                                {booking.start_time}
                                {' '}
                                {booking.end_time}
                            </p>

                            <p>
                                Статус:
                                {' '}
                                <strong
                                    className={styles[`status${booking.status}`]}
                                >
                                    {booking.status}
                                </strong>
                            </p>

                            <p>
                                Ціна:
                                {' '}
                                {booking.price}
                                {' грн'}
                            </p>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={() => handleStatusChange(
                                    booking.id,
                                    'confirmed'
                                )}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange(
                                    booking.id,
                                    'completed'
                                )}
                            >
                                Complete
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange(
                                    booking.id,
                                    'cancelled'
                                )}
                            >
                                Cancel
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default AdminBookingsPage