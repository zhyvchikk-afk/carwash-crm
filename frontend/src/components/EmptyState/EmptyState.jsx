import styles from './EmptyState.module.css'


function EmptyState({ title, description }) {
    return (
        <div className={styles.empty}>
            <h2 className={styles.title}>
                {title}
            </h2>
            <p className={styles.description}>
                {description}
            </p>
        </div>
    )
}

export default EmptyState