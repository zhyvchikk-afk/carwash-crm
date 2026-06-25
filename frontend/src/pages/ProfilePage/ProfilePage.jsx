import { useEffect, useState } from "react";
import api from '../../api/axios'

import styles from './ProfilePage.module.css'

import toast from "react-hot-toast"


function ProfilePage() {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        telegram_chat_id: null,
    })
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
    })

    useEffect(() => {
        api
            .get('/auth/me/')
            .then(response => {
                setFormData(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async event => {
        event.prevenDefault()

        try {
            await api.patch('/auth/me/',
                {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                }
            )

            toast.success('Профіль успішно оновлено!')
        }
        catch(error) {
            console.log(error)
            toast.error('Помилка при оновленні профілю.')
        }
    }


    const handlePasswordChange = event => {
        setPasswordData({
            ...passwordData,
            [event.target.name]: event.target.value,
        })
    }

    const handlePasswordSubmit = async event => {
        event.preventDefault()

        try {
            const response = await api.post(
                '/auth/change-password/',
                passwordData,
            )

            localStorage.setItem(
                'accessToken',
                response.data.access,
            )

            localStorage.setItem(
                'refreshToken',
                response.data.refresh,
            )

            setPasswordData({
                old_password: '',
                new_password: '',
                new_password_confirm: '',
            })

            toast.success('Пароль успішно змінено!')
        } catch (error) {
            console.log(error)

            const message = 
                error.response?.data?.old_password ||
                error.response?.data?.new_password_confirm ||
                'Не вдалося змінити пароль.'

            toast.error(message)
        }
    }

    return (
        <div className={styles.container}>
            <h1>Мій профіль</h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <label>Логін</label>
                <input 
                    type="text"
                    value={formData.username}
                    disabled                
                />

                <label>Ім'я</label>
                <input 
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}        
                />

                <label>Прізвище</label>
                <input 
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}        
                />

                <label>Email</label>
                <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required    
                />

                <label>Телефон</label>
                <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}        
                />

                <label>Telegram</label>
                <input 
                    type="text"
                    disabled
                    value={
                        formData.telegram_chat_id
                        ? 'Підключено ✅'
                        : 'Не підключено ❌'
                    }
                />

                <button type="submit">
                    Зберегти зміни
                </button>
            </form>

            
            <h2 className={styles.sectionTitle}>Зміна паролю</h2>
            
            <form
                className={styles.form}
                onSubmit={handlePasswordSubmit}
            >
                <label>Старий пароль</label>
                <input
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                />

                <label>Новий пароль</label>
                <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                />

                <label>Підтвердження нового паролю</label>
                <input
                    type="password"
                    name="new_password_confirm"
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                />

                <button type="submit">
                    Змінити пароль
                </button>
            </form>
        </div>
    )
}

export default ProfilePage