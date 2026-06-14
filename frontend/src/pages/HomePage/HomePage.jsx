import { useContext, useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

import styles from './HomePage.module.css'

function HomePage() {
    const { user, isAuthenticated } = useAuth()

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

                    <a href="/booking/create">
                        Записатися
                    </a>
                </div>
            </section>
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
    )
}

export default HomePage