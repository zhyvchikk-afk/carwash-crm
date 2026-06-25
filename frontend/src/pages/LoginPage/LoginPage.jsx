import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext"

import styles from './LoginPage.module.css'

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [error, setError] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        try {
            await login(formData.username, formData.password)
            navigate('/')
        } catch (error) {
            setError('Невірний логін чи пароль')
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
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Вхід</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Логін
                    <input 
                        className={styles.input}
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}    
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

                {error && (
                    <p className={styles.error}>{error}</p>
                )}

                <button 
                    className={styles.button} 
                    type="submit"
                    onMouseMove={handleMouseMove}
                >    
                    Увійти
                </button>
                <Link
                    to='/forgot-password'
                    className={styles.link}    
                >
                    Забули пароль?
                </Link>
            </form>
        </div>
    )
}

export default LoginPage