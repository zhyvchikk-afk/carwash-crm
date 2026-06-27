import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import api from '../../api/axios'

import styles from './HomePage.module.css'
import { FaInstagram } from 'react-icons/fa'

import GallerySection from '../../components/GallerySection/GallerySection'

function HomePage() {
    const { user, isAuthenticated } = useAuth()

    const isManager = 
        user?.role === 'admin' ||
        user?.role === 'manager'
    
    const [stats, setStats] = useState(null)
    const [reviews, setReviews] = useState([])
    const [showFaq, setShowFaq] = useState(false)

    async function loadReviews() {
        try {
            const response = await api.get(
                '/reviews/'
            )

            setReviews(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function loadStats() {
        try {
            const response = await api.get(
                '/public/stats/'
            )
            setStats(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadStats()
        loadReviews()
    }, [])

    return(
        <div>
            <section className={styles.hero}>
                <div className={styles.content}>
                    <h1>
                        Професійна автомийка
                    </h1>
                    <p>
                        Швидко. Якісно. Зручно.
                    </p>
                    {(!isManager
                        ? 
                        <a href="/booking/create">
                            Записатися
                        </a>
                        :
                        <>
                            <a 
                                href="/admin/bookings/"
                                className={styles.a}    
                            >Керування</a>
                            <a 
                                href="/dashboard/"
                                className={styles.a}
                            >Статистика</a>
                            <a 
                                href="/admin/calendar/"
                                className={styles.a}
                            >Календар</a>
                        </>
                    )}
                </div>
            </section>

            <div className={styles.telegramWrapper}>
                {user && !user.telegram_chat_id && (
                    <>
                    <a
                        className={styles.tgButton} 
                        href={`https://t.me/carwashVasylBot?start=${user?.id}`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        📱 Підключити телеграм
                    </a>
                    </>
                )}
            </div>
            
            
            <section className={styles.features}>
                
                <div className={styles.featureCard}>
                    <div className={styles.featuredIcon}>
                        🚗
                    </div>
                    <h3>Якісна автохімія</h3>
                    <p>
                        Використовуємо професійні засоби для
                        дбайливого догляду за автомобілем.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.featuredIcon}>
                        ⏱️
                    </div>
                    <h3>Онлайн запис</h3>
                    <p>
                        Обирайте послуги та зручний час
                        у кілька кліків.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.featuredIcon}>
                        💬
                    </div>
                    <h3>Telegram-нагадування</h3>
                    <p>
                        Отримуйте повідомлення про записи
                        та зміни без дзвінків.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.featuredIcon}>
                        ⭐
                    </div>
                    <h3>Досвідчені майстри</h3>
                    <p>
                        Професійний підхід і увага до
                        кожної деталі.
                    </p>
                </div>
            </section>
            <section className={styles.popularSection}>
                <h2 className={styles.sectionTitle}>
                    Популярні послуги
                </h2>
                <p className={styles.sectionSubtitle}>
                    Найчастіше замовляють саме ці послуги
                </p>
                <div className={styles.servicesGrid}>
                    <div className={styles.serviceCard}>
                        <div className={styles.serviceIcon}>
                            🚿
                        </div>
                        <h3>Мийка кузова</h3>
                        <p>
                            Делікатне очищеня кузова
                            професійною автохімією.
                        </p>
                    </div>

                    <div className={styles.serviceCard}>
                        <div className={styles.serviceIcon}>
                            🧽
                        </div>
                        <h3>Хімчистка салону</h3>
                        <p>
                            Глибоке очищення сидінь, пластику
                            та оббивки.
                        </p>
                    </div>

                    <div className={styles.serviceCard}>
                        <div className={styles.serviceIcon}>
                            🌧️
                        </div>
                        <h3>Антидощ</h3>
                        <p>
                            Покриття скла для кращої
                            видимості під час дощу.
                        </p>
                    </div>
                </div>

                <div className={styles.servicesButtonContainer}>
                    <a 
                        href="/services"
                        className={styles.servicesButton}
                    >
                        Всі послуги
                    </a>
                </div>
            </section>
            <GallerySection />
            <section className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>
                    Як це працює?
                </h2>
                <p className={styles.sectionSubtitle}>
                    Запис займає менше хвилини
                </p>
                <div className={styles.steps}>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>
                            1
                        </div>
                        <h3>Оберіть авто та послуги</h3>
                        <p>
                            Оберіть авто та додайте необхідні послуги для нього.
                        </p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>
                            2
                        </div>
                        <h3>Оберіть дату та час</h3>
                        <p>
                            Система покаже тільки доступні часові слоти.
                        </p>
                    </div>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>
                            3
                        </div>
                        <h3>Приїжджайте</h3>
                        <p>
                            Ми нагадаємо про запис через Telegram.
                        </p>
                    </div>
                </div>
            </section>
            {stats && (
                <section className={styles.statsSection}>
                    <h2 className={styles.sectionTitle}>
                        Нам довіряють
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Результати нашої роботи говорять самі за себе
                    </p>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <strong>{stats?.completed_bookings ?? 0}</strong>
                            <span>Виконаних записів</span>
                        </div>

                        <div className={styles.statCard}>
                            <strong>{stats?.clients ?? 0}</strong>
                            <span>Задоволених клієнтів</span>
                        </div>

                        <div className={styles.statCard}>
                            <strong>{stats?.services ?? 0}+</strong>
                            <span>Послуг</span>
                        </div>

                        <div className={styles.statCard}>
                            <strong>4.9★</strong>
                            <span>Середня оцінка</span>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>
                    Відгуки клієнтів
                </h2>
                {reviews.length < 5 && (
                    <div className={styles.emptyReviews}>
                        <div className={styles.reviewIcon}>
                            ⭐
                        </div>
                        <h3>
                            Ми нещодавно запустили онлайн-запис
                        </h3>
                        <p>
                            Станьте одним із перших клієнтів та
                            поділіться своїм досвідом після
                            відвідування автомийки.
                        </p>
                        <span>
                            Ваш відгук може з'явитися тут
                        </span>
                    </div>
                )}
                <div className={styles.reviewGrid}>
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={styles.reviewCard}
                        >
                            <div
                                className={styles.reviewHeader}
                            >
                                <div
                                    className={styles.avatar}
                                >
                                    {review.username[0]
                                        ?.toUpperCase()}
                                </div>
                                <div>
                                    <h4>
                                        {review.username}
                                    </h4>
                                    <span>
                                        {'⭐'.repeat(review.rating)}
                                    </span>
                                </div>
                            </div>
                            <p className={styles.reviewText}>
                                {review.text}
                            </p>
                            {review.admin_reply && (
                                <div className={styles.adminReply}>
                                    <strong>Відповідь адміністратора</strong>
                                    <p>{review.admin_reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>
                    Часті запитання
                </h2>

                <button
                    className={styles.faqToggle}
                    onClick={() => setShowFaq(!showFaq)}
                >
                    {
                        showFaq
                        ? 'Приховати запитання ▲'
                        : 'Показати запитання ▼'
                    }
                </button>
                {showFaq && (
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h3>
                                Як записатися на автомийку?
                            </h3>
                            <p>
                                Оберіть автомобіль, потрібні
                                послуги та доступний час.
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3>
                                Чи можна перенести запис?
                            </h3>
                            <p>
                                Так. У розділі "Мої записи"
                                натисніть кнопку перенести.
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3>
                                Чи приходять нагадування?
                            </h3>
                            <p>
                                Так. Через Telegram-бота.
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3>
                                Які способи оплати доступні?
                            </h3>
                            <p>
                                Наразі оплата здійснюється
                                безпосередньо на автомийці
                                після надання послуги.
                            </p>
                        </div>
                    </div>
                )}
            </section>
            <section className={styles.contactSection}>
                <h2 className={styles.sectionTitle}>
                    Контакти
                </h2>

                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <h3>📍 Адреса</h3>
                        <p>
                            вул. Дружби, 47
                        </p>
                    </div>

                    <div className={styles.contactCard}>
                        <h3>📞 Телефон</h3>
                        <p>
                            +38 098 888 5777
                        </p>
                    </div>

                    <div className={styles.contactCard}> 
                        <h3>✉ Instagram</h3>
                        <a 
                            href="https://www.instagram.com/carwash_yuzh?igsh=MXh4aHRoZWRnbGt5cg=="
                            target='_blank'
                            rel='noreferrer'
                        >
                            Наш Instagram
                        </a>
                    </div>

                    <div className={styles.contactCard}> 
                        <h3>Графік роботи</h3>
                        <p>
                            Щодня 09:00 - 20:00
                        </p>
                    </div>
                </div>
            </section>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div>
                        <h3>CarWash</h3>

                        <p>
                            Онлайн запис на автомийку
                            швидко та зручно.
                        </p>
                    </div>
                    <div>
                        <h4>Навігація</h4>
                        <ul>

                            <li>
                                <Link 
                                    to='/services'
                                    className={styles.link}
                                >
                                    Послуги
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/bookings'
                                    className={styles.link}
                                >
                                    Мої записи
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to='/profile'
                                    className={styles.link}
                                >
                                    Мій профіль
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>Контакти</h4>
                        <ul>
                            <li>+38 098 888 5777</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    © 2026 CarWash. Усі права захищені.
                </div>
            </footer>
        </div>
    )
}

export default HomePage