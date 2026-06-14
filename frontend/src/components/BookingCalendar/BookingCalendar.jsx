import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import styles from './BookingCalendar.module.css'


function BookingCalendar({
    selectedDate,
    onDateChange,
    slots,
    selectedTime,
    onTimeSelect,
}) {
    return (
        <div className={styles.wrapper}>
            <Calendar
                value={selectedDate}
                onChange={onDateChange}
                minDate={new Date()}    
            />
            <div className={styles.slots}>
                {slots.map((slot) => (
                    <button
                        key={slot.start_time}
                        type='button'
                        className={
                            selectedTime === slot.start_time
                            ? styles.activeSlot
                            : styles.slot
                        }
                        onClick={() => 
                            onTimeSelect(slot.start_time)
                        }
                    >
                        {slot.start_time}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default BookingCalendar