import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from '../../api/axios'

import styles from './CreateBookingPage.module.css'
import toast from "react-hot-toast"



function CreateBookingPage() {
    const navigate = useNavigate()

    const [cars, setCars] = useState([])
    const [services, setServices] = useState([])
    const [slots, setSlots] = useState([])

    const [error, setError] = useState('')
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

    const [selectedServices, setSelectedServices] = useState([])
    const [selectedCar, setSelectedCar] = useState('')

    const [formData, setFormData] = useState({
        car: '',
        services: selectedServices,
        date: '',
        start_time: '',
        comment: '',
    })

    async function loadInitialData() {
        try {
            const [carsResponse, servicesResponse] = await Promise.all([
                api.get('/cars/'),
                api.get('/services/'),
            ])

            setCars(carsResponse.data)
            setServices(servicesResponse.data)
        } catch (error) {
            setError('Не вдалося завантажити дані')
        }
    }

    async function loadSlots(serviceId, date) {
        if (!serviceId || serviceId.length === 0 || !date) {
            setSlots([])
            return
        }

        setIsLoadingSlots(true)

        try {
            const response = await api.get('/available-slots/', {
                params: {
                    services: serviceId.join(','),
                    date,
                },
            })

            setSlots(response.data.slots || [])
        } catch (error) {
            setError('Не вдалося завантажити доступний час')
        } finally {
            setIsLoadingSlots(false)
        }
    }

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        loadSlots(selectedServices, formData.date)
    }, [selectedServices, formData.date])

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'date' ? {start_time: '',} : {}),
        }))

        if (name === 'car') {
            setSelectedCar(value)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        const toastId = toast.loading('Створення запису...')
        try {
            await api.post('/bookings/', formData)
            navigate('/bookings')
            toast.success('Запис успішно створено!', { id: toastId })
        } catch (error) {
            toast.error('Не вдалося створити запис', { id: toastId })
        }
    }

    const handleServiceToggle = (serviceId) => {
        let updatedServices

        if (selectedServices.includes(serviceId)) {
            updatedServices = selectedServices.filter((id) => 
            id !== serviceId)
        } else {
            updatedServices = [
                ...selectedServices,
                serviceId,
            ]
        }

        setSelectedServices(updatedServices)

        setFormData((prev) => ({
            ...prev,
            services: updatedServices,
            start_time: '',
        }))
    }

    const selectedCarObject = cars.find((car) => 
        car.id === Number(selectedCar)
    )

    const totalDuration = services.filter((service) => 
        selectedServices.includes(
            service.id
        )).
        reduce((total, service) => 
        total + service.duration_minutes, 0
    )

    const totalPrice = 
        !selectedCarObject
            ? 0
            : services
                .filter(
                    service =>
                        selectedServices.includes(
                            service.id
                        )
                )
                .reduce(
                    (
                        sum,
                        service
                    ) => {
                        const currentPrice = 
                            service.prices?.find(
                                price =>
                                    price.body_type.id ===
                                    selectedCarObject.body_type
                            )
                        
                            return (
                                sum +
                                Number(currentPrice?.price || 0)
                            )
                    }, 0
                )



    const bodyTypeId = selectedCarObject?.body_type

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Запис на мийку</h1>

            {error && (
                <p className={styles.error}>{error}</p>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Авто
                    <select 
                        className={styles.input}
                        name="car"
                        value={formData.car}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Оберіть авто</option>
                        {cars.map((car) => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model} - {car.body_type_detail?.title}
                            </option>
                        ))}
                    </select>
                </label>

                <div>
                    <h4>Оберіть послуги</h4>
                    {services.map((service) => (
                        <label
                            key={service.id}
                            style={{
                                display: 'block',
                                marginBottom: '10px',
                            }}
                        >
                            <input 
                                type="checkbox"
                                checked={selectedServices.includes(
                                    service.id
                                )}
                                onChange={() => 
                                    handleServiceToggle(
                                        service.id
                                    )
                                }
                            />
                            {' '}{service.title}
                        </label>
                    ))}
                </div>
                <div className={styles.summary}>
                    <p>
                        Загальний час:
                        {' '}
                        {totalDuration}
                        хв
                    </p>
                    <p>
                        Загальна вартість:
                        {' '}
                        {totalPrice}
                        грн
                    </p>
                </div>

                <label className={styles.label}>
                    Дата
                    <input
                        className={styles.input}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Доступний час (початок - кінець послуги)
                    <select
                        className={styles.input}
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        disabled={selectedServices.length === 0 || !formData.date}
                    >
                        <option value="">
                            {isLoadingSlots ? 'Завантаження...' : 'Оберіть час'}
                        </option>

                        {slots.map((slot) => (
                            <option key={slot.start_time} value={slot.start_time}>
                                {slot.start_time} - {slot.end_time}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.label}>
                    Коментар
                    <textarea
                        className={styles.textarea}
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Наприклад: Зателефонуйте за 10 хв"
                    />
                </label>

                <button className={styles.button} type="submit">
                    Записатися
                </button>
            </form>
        </div>
    )
}

export default CreateBookingPage