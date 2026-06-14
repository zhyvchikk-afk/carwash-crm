import styles from './CalendarToolbar.module.css'

function CalendarToolbar(toolbar) {

    const months = [
        'січня',
        'лютого',
        'березня',
        'квітня',
        'травня',
        'червня',
        'липня',
        'серпня',
        'вересня',
        'жовтня',
        'листопада',
        'грудня',
    ]

    const weekdays = [
        'Неділя',
        'Понеділок',
        'Вівторок',
        'Середа',
        'Четвер',
        "П'ятниця",
        'Субота',
    ]

    let label = toolbar.label

    if (toolbar.view === 'day') {
        const date = new Date(toolbar.date)

        label = 
            `${weekdays[date.getDay()]},` +
            `${date.getDate()}` +
            `${months[date.getMonth()]}` +
            `${date.getFullYear()}`
    }

    if (toolbar.view === 'week') {
        const start = new Date(toolbar.date)
        const end = new Date(toolbar.date)

        const day = start.getDay()
        const diff = day === 0 ? -6 : 1 - day
        start.setDate(start.getDate() + diff)

        end.setDate(start.getDate() + 6)

        if (start.getMonth() === end.getMonth()) {
            label = 
                `${start.getDate()}-${end.getDate()}` +
                `${months[start.getMonth()]}` +
                `${start.getFullYear()}`
        } else {
            label = 
                `${start.getDate()} ${months[start.getMonth()]} — ` +
                `${end.getDate()} ${months[end.getMonth()]} ` +
                `${start.getFullYear()}`
        }

    }

    return (
        <div className={styles.toolbar}>
            <div className={styles.navigation}>
                <button
                    type='button'
                    onClick={() => 
                        toolbar.onNavigate('PREV')
                    }
                >
                    ← Назад
                </button>
                
                <button
                    type='button'
                    onClick={() => 
                        toolbar.onNavigate('TODAY')
                    }
                >
                    Сьогодні
                </button>
                
                <button
                    type='button'
                    onClick={() => 
                        toolbar.onNavigate('NEXT')
                    }
                >
                    Вперед →
                </button>
            </div>
        
            <h2 className={styles.label}>
                {label}
            </h2>

            <div className={styles.views}>
                <button
                    type='button'
                    className={
                        toolbar.view === 'day' ? styles.activeButton : ''
                    }
                    onClick={() => toolbar.onView('day')}
                >
                    День
                </button>

                <button
                    type='button'
                    className={
                        toolbar.view === 'week' ? styles.activeButton : ''
                    }
                    onClick={() => toolbar.onView('week')}
                >
                    Тиждень
                </button>

                <button
                    type='button'
                    className={
                        toolbar.view === 'agenda' ? styles.activeButton : ''
                    }
                    onClick={() => toolbar.onView('agenda')}
                >
                    Список
                </button>
            </div>
        </div>
        
    )
}

export default CalendarToolbar