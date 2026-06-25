import styles from './TopClientsCard.module.css'

function TopClientsCard({ clients }) {
    return (
        <div className={styles.card}>
            <h2>👑 ТОП клієнтів</h2>
            <div className={styles.list}>
                {clients.map((client, index) => (
                    <div
                        key={client.username}
                        className={styles.item}
                    >
                        <div>
                            <strong>
                                {index + 1}. {client.username}
                            </strong>
                            <p>
                                Відвідувань:
                                {' '}
                                {client.bookings_count}
                            </p>
                        </div>
                        <span>
                            {Number(client.total_spent)
                                .toLocaleString('uk-UA')
                            }{' '} грн
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopClientsCard