import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext"

import styles from './RegisterPage.module.css'


function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirm: '',
    })
    
    const [error, setError] = useState('')

    function handleChange(event) {
        const {name, value} = event.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        try {
            await register(formData)
            navigate('/')
        } catch (error) {
            setError('Помилка реєстрації. Перевірте дані.')
        }
    }

    const handleMouseMove = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--x', `${x}px`)
        button.style.setProperty('--y', `${y}px`)
    };
    
    return(
        <div className="styles.wrapper">
            <h1 className={styles.title}>Реєстрація</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Логін
                    <input 
                        className={styles.input}
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="mazepa"
                    />
                </label>
                <label className={styles.label}>
                    Ім'я
                    <input 
                        className={styles.input}
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Іван"
                    />
                </label>
                <label className={styles.label}>
                    Прізвище
                    <input 
                        className={styles.input}
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Мазепа"
                    />
                </label>
                <label className={styles.label}>
                    Телефон 
                    <p className={styles.formatPhone}>Введіть номер у форматі 0671234567</p>
                    <input 
                        className={styles.input}
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0671234567"
                        required
                    />
                </label>
                <label className={styles.label}>
                    Email
                    <input 
                        className={styles.input}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Необов'язково"
                    />
                </label>
                <label className={styles.label}>
                    Пароль
                    <input 
                        className={styles.input}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <label className={styles.label}>
                    Повторіть пароль
                    <input 
                        className={styles.input}
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                    />
                </label>

                {error && (
                    <p className={styles.error}>{error}</p>
                )}

                <button 
                    className={styles.button} 
                    type="submit"
                    onMouseMove={handleMouseMove}
                >
                    Зареєструватися
                </button>
            </form>
        </div>
    )
}

export default RegisterPage