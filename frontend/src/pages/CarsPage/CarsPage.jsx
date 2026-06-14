import { useEffect, useState } from "react"

import api from '../../api/axios'

import styles from './CarsPage.module.css'
import EmptyState from '../../components/EmptyState/EmptyState'


function CarsPage() {
    const [cars, setCars] = useState([])
    const [bodyTypes, setBodyTypes] = useState([])
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        body_type: '',
        brand: '',
        model: '',
        plate_number: '',
        color: '',
    })

    async function loadData() {
        try {
            const [carsResponse, bodyTypesResponse] = await Promise.all([
                api.get('/cars/'),
                api.get('/body-types/'),
            ])
            setCars(carsResponse.data)
            setBodyTypes(bodyTypesResponse.data)
        } catch (error) {
            setError('Не вдалося завантажити авто')
        }
    }

    useEffect(() => {
        loadData()
    }, [])

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
            await api.post('/cars/', formData)

            setFormData({
                body_type: '',
                brand: '',
                model: '',
                plate_number: '',
                color: '',
            })

            await loadData()
        } catch (error) {
            setError('Не вдалося додати авто')
        }
    }

    async function handleDelete(carId) {
        try {
            await api.delete(`/cars/${carId}/`)
            await loadData()
        } catch (error) {
            setError('Не вдалося видалити авто')
        }
    }

    return (
        <div className={styles.background}>
            <div className={styles.page}>
                <h1 className={styles.title}>Мої авто</h1>
                
                {error && (
                    <p className={styles.error}>{error}</p>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.subtitle}>Додати авто</h2>

                    <select 
                        className={styles.input}
                        name="body_type"
                        value={formData.body_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Оберіть тип кузова</option>
                        {bodyTypes.map((bodyType) => (
                            <option key={bodyType.id} value={bodyType.id}>
                                {bodyType.title}
                            </option>
                        ))}
                    </select>

                    <input 
                        className={styles.input}
                        type="text"
                        name="brand"
                        placeholder="Марка"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />

                    <input 
                        className={styles.input}
                        type="text"
                        name="model"
                        placeholder="Модель"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />

                    <input 
                        className={styles.input}
                        type="text"
                        name="plate_number"
                        placeholder="Номерний знак"
                        value={formData.plate_number}
                        onChange={handleChange}
                        required
                    />

                    <input 
                        className={styles.input}
                        type="text"
                        name="color"
                        placeholder="Колір"
                        value={formData.color}
                        onChange={handleChange}
                        required
                    />

                    <button className={styles.button} type="submit">
                        Додати авто
                    </button>
                </form>
                
                {!cars.length && <EmptyState
                    title='Немає авто'
                    description='Додайте перше авто'
                /> }

                <div className={styles.list}>
                    {cars.map((car) => (
                        <article key={car.id} className={styles.card}>
                            <div>
                                <h3 className={styles.carTitle}>
                                    {car.brand} {car.model}
                                </h3>
                                <p>Тип кузова: {car.body_type_detail?.title}</p>
                                {car.plate_number && (
                                    <p>Номерний знак: {car.plate_number}</p>
                                )}
                                {car.color && (
                                    <p>Колір: {car.color}</p>
                                )}
                            </div>

                            <button
                                className={styles.deleteButton}
                                type="button"
                                onClick={() => handleDelete(car.id)}
                            >
                                Видалити
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CarsPage