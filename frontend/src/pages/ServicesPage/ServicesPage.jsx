import { useEffect, useState } from "react"

import api from '../../api/axios'

import styles from './ServicesPage.module.css'
import Loader from '../../components/Loader/Loader'



function ServicesPage() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    async function loadCategories() {
        try {
            const response = await api.get('/categories/')
            setCategories(response.data)
        } catch (error) {
            setError('Не вдалося завантажити послуги')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <p className={styles.error}>{error}</p>
    }

    function groupPricesByAmount(prices) {
        if (!prices) return []
        const grouped = {}

        prices.forEach((item) => {
            const price = item.price
            if (price === undefined || price === null) return

            if (!grouped[price]) {
                grouped[price] = []
            }

            let bodyName = 'Будь-який кузов'

            if (item.body_type_detail && typeof item.body_type_detail === 'object') {
                bodyName = item.body_type_detail.title || item.body_type_detail.name
            } else if (item.body_type && typeof item.body_type === 'object') {
                bodyName = item.body_type.title || item.body_type.name
            } else if (item.body_type) {
                bodyName = item.body_type
            }

            grouped[price].push(bodyName)
        })

        return Object.entries(grouped).map(
            ([price, bodyTypes]) => ({
                price,
                bodyTypes: bodyTypes || [],
            })
        )
    }



    return(
        <div className={styles.page}>
            <h1 className={styles.title}>Послуги</h1>

            <div className={styles.categories}>
                {categories.map((category) => (
                    <section key={category.id} className={styles.category}>
                        <h2 className={styles.categoryTitle}>
                            {category.title}
                        </h2>

                        <div className={styles.services}>
                            {category.services.map((service) => {
                                const groupedPrices = groupPricesByAmount(service.prices)
                                return (
                                    <article key={service.id} className={styles.card}>
                                        <h3 className={styles.serviceTitle}>
                                            {service.title}
                                        </h3>

                                        <p className={styles.description}>
                                            {service.description || "Невдовзі тут з'явиться опис послуги"}
                                        </p>

                                        <p className={styles.duration}>
                                            Тривалість: {service.duration_minutes} хв
                                        </p>
                                        
                                        <div className={styles.prices}>
                                            {groupedPrices.map((group) => (
                                                <div
                                                    key={group.price}
                                                    className={styles.priceRow}
                                                >
                                                    <span>
                                                        {group.bodyTypes.join(' / ') || 'Всі кузови'}
                                                    </span>
                                                    <strong>
                                                        {group.price} грн
                                                    </strong>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}

export default ServicesPage