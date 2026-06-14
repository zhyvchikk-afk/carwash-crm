import styles from './Button.module.css'


function Button({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${styles[variant]}`}
        >
            {children}
        </button>
    )
}


export default Button