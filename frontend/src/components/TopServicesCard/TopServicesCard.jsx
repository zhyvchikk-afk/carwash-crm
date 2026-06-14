import styles from './TopServicesCard.module.css'

function TopServicesCard({services,}) {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>
                🏆 ТОП послуг
            </h2>

            <div className={styles.list}>
                {services.map((service, index) => (
                    <div
                        key={service.title}
                        className={styles.item}
                    >
                        <span>
                            {index + 1 }.{' '}
                            {service.title}
                        </span>

                        <strong>
                            {service.count}
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopServicesCard