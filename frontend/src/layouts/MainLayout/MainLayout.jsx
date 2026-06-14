import { Outlet } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'

import styles from './MainLayout.module.css'

function MainLayout() {
    return (
        <div className={styles.page}>
            <Navbar />

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout