import { Outlet } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'
import BackgroundDecor from '../../components/BackgroundDecor/BackgroundDecor'

import styles from './MainLayout.module.css'

function MainLayout() {
    return (
        <div className={styles.site}>

            <BackgroundDecor />

            <div className={styles.page}>
                <Navbar />

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout