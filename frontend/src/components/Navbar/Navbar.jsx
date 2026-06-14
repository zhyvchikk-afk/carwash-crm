import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../../contexts/AuthContext'

import styles from '../../components/Navbar/Navbar.module.css'

import { FaBars } from 'react-icons/fa'


function Navbar() {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to='/' className={styles.logo}>
                 CarWash
                </Link>
                
                <nav className={styles.nav}>
                    {user?.role !== 'admin' && user?.role !== 'manager' && (
                        <FaBars onClick={() => setIsOpen(!isOpen)}/>
                    )}
                    <Link to='/services'>Послуги</Link>
                    
                    

                    {isAuthenticated ? (
                        <>
                        {isOpen && user.role !== 'admin' && user.role !== 'manager' && (
                            <>
                            <Link to='/cars'>Мої авто</Link>    
                            <Link to='/bookings'>Мої записи</Link>
                            <Link to='/booking/create'>Записатися</Link>    
                            </>
                        )}
                        <>
                        {(user?.role === 'admin' ||
                            user?.role === 'manager') ? (
                            <>
                            <Link to='/admin/bookings'>Адмін</Link>
                            <Link to='/admin/dashboard'>Статистика</Link>
                            <Link to='/admin/calendar'>Календар</Link>
                            </>
                            ) : (
                            <span
                                className={styles.user}
                            >
                                {user?.username}
                            </span>
                        )}
                        </>
                            
                            <button 
                                className={styles.logoutButton}
                                type='button'
                                onClick={handleLogout}
                            >
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to='/login'>Вхід</Link>
                            <Link to='/register'>Реєстрація</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar