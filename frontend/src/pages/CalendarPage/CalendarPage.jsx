import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { uk } from 'date-fns/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import api from '../../api/axios';

import CalendarToolbar from "../../components/BookingCalendar/CalendarToolbar";

import styles from '../CalendarPage/CalendarPage.module.css'

const locales = { uk, }

const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales,
})

function CalendarPage() {
    const [events, setEvents] = useState([])
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState('day')

    useEffect(() => {
        loadBookings()
    }, [])

    async function loadBookings() {
        try {
            const response = await api.get(
                '/bookings/admin-list/'
            )

            const calendarEvents = 
                response.data.map((booking) => ({
                    id: booking.id,

                    title:
                        `${booking.user_username} - ` +
                        `${booking.car_detail.brand} ${booking.car_detail.model}`,
                    
                    start: new Date(
                        `${booking.date}T${booking.start_time}`
                    ),

                    end: new Date(
                        `${booking.date}T${booking.end_time}`
                    ),

                    resource: booking,
                }))
            
            setEvents(
                calendarEvents
            )
        } catch (error) {
            console.error(error)
        }
    }

    async function handleStatusChange(bookingId, status) {
        try {
            await api.patch(`/bookings/${bookingId}/change-status/`,
                {
                    status,
                }
            )
            setSelectedBooking(null)

            await loadBookings()
        } catch (error) {
            console.error(error)
            alert('Не вдалося змінити статус запису.')
        }
    }

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3b82f6'

        switch (event.resource.status) {
            case 'pending':
                backgroundColor = '#f59e0b'
                break
            case 'confirmed':
                backgroundColor = '#0ea5e9'
                break
            case 'completed':
                backgroundColor = '#22c55e'
                break
            case 'cancelled':
                backgroundColor = '#ef4444'
                break
            default:
                backgroundColor = '#6b7280'
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '8px',
                border: 'none',
                color: 'white',
                padding: '2px 6px',
            },
        }
    }

    let messages = {
        today: 'Сьогодні',
        previous: 'Назад',
        next: 'Вперед',
        month: 'Місяць',
        week: 'Тиждень',
        day: 'День',
        agenda: 'Список',
        date: 'Дата',
        time: 'Час',
        event: 'Запис',
    }

    const statusLabels = {
        pending: 'Очікує',
        confirmed: 'Підтверджено',
        completed: 'Виконано',
        cancelled: 'Скасовано',
    }

    return (
        <div
            className={styles.page}
        >
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.legendPending}`}/>
                    <span>Очікує на підтвердження</span>
                </div>
                
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.legendConfirmed}`}/>
                    <span>Підтверджено</span>
                </div>

                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.legendCompleted}`}/>
                    <span>Виконано</span>
                </div>

                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.legendCancelled}`}/>
                    <span>Скасовано</span>
                </div>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                defaultView="day"
                date={currentDate}
                view={currentView}
                onNavigate={(date) => setCurrentDate(date)}
                onView={(view) => setCurrentView(view)}
                views={[
                    'day',
                    'week',
                    'agenda',
                ]}
                step={30}
                timeslots={1}
                eventPropGetter={eventStyleGetter}
                messages={messages}
                components={{toolbar: CalendarToolbar,}}
                onSelectEvent={(event) => {
                    setSelectedBooking(event.resource)
                }}
            />
            {selectedBooking && (
                <div
                    className={styles.overlay}
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedBooking(null)}
                        >
                            ✕
                        </button>

                        <h2>Деталі запису</h2>
                        
                        <p>
                            <strong>Клієнт:</strong>{' '}
                            {selectedBooking.user_username}
                        </p>
                        
                        <p>
                            <strong>Телефон:</strong>{' '}
                            <a 
                                href={`tel:${selectedBooking.user_phone}`}
                                className={styles.phoneLink}
                            >
                                {selectedBooking.user_phone}
                            </a>
                            
                        </p>
                        <a 
                            href={`tel:${selectedBooking.user_phone}`}
                            className={styles.callButton}    
                        >
                            📞 Подзвонити клієнту
                        </a>

                        <p>
                            <strong>Авто:</strong>{' '}
                            {selectedBooking.car_detail?.brand}{' '}
                            {selectedBooking.car_detail?.model}
                        </p>

                        <p>
                            <strong>Дата:</strong>{' '}
                            {selectedBooking.date}
                        </p>

                        <p>
                            <strong>Час:</strong>{' '}
                            {selectedBooking.start_time}
                            {' - '}
                            {selectedBooking.end_time}
                        </p>

                        <p>
                            <strong>Тривалість:</strong>{' '}
                            {selectedBooking.duration_minutes} хв
                        </p>

                        <p>
                            <strong>Статус:</strong>{' '}
                            <span
                                className={
                                    styles[`status${selectedBooking.status}`]
                                }
                            >
                                {statusLabels[
                                    selectedBooking.status
                                ]}
                            </span>
                        </p>

                        <h3>
                            Послуги
                        </h3>
                        <ul
                            className={styles.servicesList}
                        >
                            {selectedBooking.service_details?.map(
                                (service) => (
                                    <li
                                        key={service.id}
                                    >
                                       ✓{' '}{service.title}
                                    </li>
                                )
                            )}
                        </ul>

                        {selectedBooking.comment && (
                            <>
                                <h3>
                                    Коментар
                                </h3>
                                <p>
                                    {selectedBooking.comment}
                                </p>
                            </>
                        )}

                        <div className={styles.actions}>
                            {selectedBooking.status !== 'confirmed' && (
                                <button
                                    className={styles.confirmButton}
                                    onClick={() => 
                                        handleStatusChange(
                                            selectedBooking.id,
                                            'confirmed',
                                        )
                                    }
                                >
                                    ✅ Підтвердити
                                </button>
                            )}

                            {selectedBooking.status !== 'completed' && (
                                <button
                                    className={styles.completeButton}
                                    onClick={() => 
                                        handleStatusChange(
                                            selectedBooking.id,
                                            'completed',
                                        )
                                    }
                                >
                                    🏁 Завершити
                                </button>
                            )}

                            {selectedBooking.status !== 'cancelled' && (
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => 
                                        handleStatusChange(
                                            selectedBooking.id,
                                            'cancelled',
                                        )
                                    }
                                >
                                    ❌ Скасувати
                                </button>
                            )}
                        </div>
                    </div>

                    
                </div>
            )}
        </div>
    )
}

export default CalendarPage