import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../api/axios'

import styles from './ResetPasswordPage.module.css'

import toast from 'react-hot-toast'

function ResetPasswordPage() {
    const navigate = useNavigate()

    const { uid, token } = useParams()

    const [formData, setFormData] = useState({
        new_password: '',
        new_password_confirm: '',
    })

    const handleChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            await api.post(
                '/auth/reset-password/',
                {
                    uid,
                    token,
                    ...formData,
                }
            )

            toast.success('Пароль успішно змінено!')
            navigate('/login')
        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.detail ||
                'Не вдалося змінити пароль.'
            )
        }
    }

    return (
        <div className={styles.container}>
            <h1>Новий пароль</h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <label>Новий пароль</label>
                <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                />

                <label>Підтвердження пароля</label>
                <input
                    type="password"
                    name="new_password_confirm"
                    value={formData.new_password_confirm}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Змінити пароль</button>
            </form>
        </div>
    )
}

export default ResetPasswordPage