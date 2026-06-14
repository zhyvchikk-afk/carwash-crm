import  { useEffect, useState } from 'react'
import  { Link } from 'react-router-dom'

import api from '../../api/axios'

import styles from './BookingsPage.module.css'
import Loader from '../../components/Loader/Loader'



function BookingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [bookings, setBookings] = useState([])
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    async function loadBookings() {
        try {
            const response = await api.get('/bookings/',
                {
                    params: {
                        search,
                    },
                }
            )
            setBookings(response.data)
        } catch (error) {
            setError('Не вдалося завантажити записи')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadBookings()
    }, [search])

    async function handleCancel(bookingId) {
        try {
            await api.delete(`/bookings/${bookingId}/`)
            await loadBookings()
        } catch (error) {
            setError('Не вдалося скасувати запис')
        }
    }

    if (isLoading) {
        return <Loader />
    }


    return(
        <div className={styles.page}>
            <div className={styles.header}>
                <input
                    className={styles.searchInput} 
                    type='text'
                    placeholder='Пошук за маркою, моделлю або номером авто...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <h1 className={styles.title}>Мої записи</h1>

                <Link className={styles.createLink} to='/booking/create'>
                    Новий запис
                </Link>
            </div>

            {error && (
                <p className={styles.error}>{error}</p>
            )}

            <div className={styles.list}>
                {bookings.map((booking) => (
                    <article key={booking.id} className={styles.card}>
                        <div>
                            <h3 className={styles.service}>
                                Послуги
                            </h3>

                            <ul className={styles.servicesList}>
                                {booking.service_details?.map((service) => (
                                    <li
                                        key={service.id}
                                        className={styles.serviceItem}
                                    >
                                        ✓ {service.title}
                                    </li>
                                ))}
                            </ul>

                            <p>Авто: {booking.car_detail?.brand} {booking.car_detail?.model}</p>
                            <p>Дата: {booking.date}</p>
                            <p>Час: {booking.start_time} - {booking.end_time}</p>
                            <p>Тривалість:{' '}{booking.duration_minutes} хв</p>
                            <p>Ціна: {booking.price} грн</p>
                            <p>Статус:{' '}
                                <span 
                                    className={
                                        styles[`status${booking.status}`]
                                    }
                                >
                                    {booking.status}
                                </span>
                            </p>
                            {booking.comment && (
                                <p>Коментар: {booking.comment}</p>
                            )}
                        </div>

                        {booking.status == 'pending' && (
                            <button 
                                className={styles.cancelButton}
                                type='button'
                                onClick={() => handleCancel(booking.id)}
                            >
                                Скасувати
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </div>
    )
}

export default BookingsPage