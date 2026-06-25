import { useState } from "react";
import api from '../../api/axios'

import styles from './ForgotPasswordPage.module.css'

import toast from 'react-hot-toast'


function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            const response = await api.post(
                '/auth/forgot-password/',
                {
                    email,
                }
            )

            setMessage(response.data.detail)
            toast.success(
                'На пошту надіслано посилання для відновлення паролю.',
                {duration: 5000,}
            )
        } catch (error) {
            console.log(error)

            setMessage('Не вдалося надіслати лист.')
        }
    }

    return (
        <div className={styles.container}>
            <h1>Відновлення пароля</h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={event => 
                        setEmail(event.target.value)
                    }
                    required
                />

                <button type="submit">Надіслати лист</button>
            </form>

            {message && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default ForgotPasswordPage