import  { useEffect, useState } from 'react'
import  { Link } from 'react-router-dom'

import api from '../../api/axios'

import styles from './BookingsPage.module.css'
import Loader from '../../components/Loader/Loader'
import toast from 'react-hot-toast'



function BookingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [bookings, setBookings] = useState([])
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const [selectedBooking, setSelectedBooking] = useState(null)
    const [newDate, setNewDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])

    const [reviewBooking, setReviewBooking] = useState(null)
    const [rating, setRating] = useState(5)
    const [reviewText, setReviewText] = useState('')
    
    const openRescheduleModal = booking => {
        setSelectedBooking(booking)

        setNewDate('')
        setSelectedTime('')
        setAvailableSlots([])
    }

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
    
    async function handleReschedule() {
        try {
            await api.patch(
                `/bookings/${selectedBooking.id}/reschedule/`,
                {
                    date: newDate,
                    start_time: selectedTime,
                }
            )

            await loadBookings()

            setSelectedBooking(null)

            setNewDate('')
            setSelectedTime('')

            toast.success('Запис успішно перенесено.')
        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.detail ||
                'Не вдалося перенести запис.'
            )
        }
    }

    async function handleReviewSubmit() {
        try {
            await api.post(
                `/bookings/${reviewBooking.id}/review/`,
                {
                    rating,
                    text: reviewText,
                }
            )

            toast.success('Дякуємо за відгук!')

            setReviewBooking(null)
            setRating(5)
            setReviewText('')

            await loadBookings()
        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.detail ||
                'Не вдалося залишити відгук.'
            )
        }
    }

    async function loadAvailableSlots(date) {
        try {
            const services = selectedBooking.service_details
                .map(service => service.id)
                .join(',')
            
            const response = await api.get(
                '/available-slots/',
                {
                    params: {
                        date,
                        services,
                    },
                }
            )

            setAvailableSlots(response.data.slots)
        } catch (error) {
            console.log(error)
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
                        <div className={styles.actions}>
                            <button
                                className={styles.rescheduleButton}
                                onClick={() => openRescheduleModal(booking)}
                            >
                                Перенести
                            </button>
                            {booking.status === 'completed' &&
                                !booking.has_review && (
                                    <button
                                        className={styles.reviewButton}
                                        onClick={() => {
                                            setReviewBooking(booking)
                                            setRating(5)
                                            setReviewText('')
                                        }}
                                    >
                                        ⭐ Залишити відгук
                                    </button>
                            )}
                            {booking.status === 'pending' && (
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => handleCancel(booking.id)}
                                >
                                    Скасувати
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
            {selectedBooking && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        
                        <h2 className={styles.modalTitle}>
                            Перенесення запису
                        </h2>

                        <p className={styles.carTitle}>
                            {selectedBooking.car_detail?.brand}
                            {' '}
                            {selectedBooking.car_detail?.model}
                        </p>

                        <div className={styles.inputGroup}>
                            <label>Нова дата</label>

                            <input
                                type='date'
                                value={newDate}
                                onChange={event => {
                                    const value = event.target.value

                                    setNewDate(value)

                                    loadAvailableSlots(value)
                                }}
                            />
                        </div>

                        <div>
                            <label>Новий час</label>
                            <select
                                value={selectedTime}
                                onChange={event =>
                                    setSelectedTime(event.target.value)
                                }
                            >
                                <option value="">
                                    Оберіть час
                                </option>
                                {availableSlots.map(slot => (
                                    <option
                                        key={slot.start_time}
                                        value={slot.start_time}
                                    >
                                        {slot.start_time} - {slot.end_time}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedBooking(null)}
                            >
                                Закрити
                            </button>

                            <button
                                className={styles.confirmButton}
                                onClick={handleReschedule}
                            >
                                Підтвердити
                            </button>
                        </div>                  
                    </div>
                </div>
            )}
            {reviewBooking && (
                <div className={styles.modal}>
                    <div className={styles.reviewModal}>
                        <h2>
                            Залишити відгук
                        </h2>
                        <p>
                            {reviewBooking.car_detail?.brand}
                            {' '}
                            {reviewBooking.car_detail?.model}
                        </p>
                        <div className={styles.ratingBlock}>
                            <label>Оцінка</label>
                            <select
                                value={rating}
                                onChange={event => 
                                    setRating(
                                        Number(event.target.value)
                                    )
                                }
                            >
                                <option value={5}>⭐⭐⭐⭐⭐</option>
                                <option value={4}>⭐⭐⭐⭐</option>
                                <option value={3}>⭐⭐⭐</option>
                                <option value={2}>⭐⭐</option>
                                <option value={1}>⭐</option>
                            </select>
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={event => setReviewText(
                                event.target.value
                            )}
                            placeholder='Поділіться своїми враженнями...'
                            rows={5}
                        />

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.closeButton}
                                onClick={() => 
                                    setReviewBooking(null)
                                }
                            >
                                Скасувати
                            </button>

                            <button
                                className={styles.confirmButton}
                                onClick={handleReviewSubmit}
                            >
                                Надіслати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingsPage