import { useEffect, useState } from "react";

import api from '../../api/axios'
import Loader from '../../components/Loader/Loader'

import styles from './AdminDashboardPage.module.css'

import RevenueChart from '../../components/RevenueChart/RevenueChart'
import RecentBookingTable from '../../components/RecentBookingsTable/RecentBookingsTable'
import TopServicesCard from "../../components/TopServicesCard/TopServicesCard";
import StatusPieChart from "../../components/StatusPieChart/StatusPieChart";
import TopClientsCard from "../../components/TopClientsCard/TopClientsCard";



function AdminDashboardPage() {
    const [error, setError] = useState('')
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [chartPeriod, setChartPeriod] = useState('month')


    async function loadDashboard() {
        try {
            const response = await api.get(
                '/admin/dashboard/'
            )

            setDashboardData(response.data)
        } catch (error) {
            setError('Не вдалося завантажити статистику')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDashboard()
    }, [])


    if (error) {
        return (
            <p className={styles.error}>
                {error}
            </p>
        )
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    if (!dashboardData) {
        return (
            <>
                <Loader />
                <h2>Не вдалося завантажити статистику</h2>
            </>
        )
    }

    let chartData = dashboardData.monthly_revenue

    if (chartPeriod === 'week') {
        chartData = dashboardData.weekly_revenue
    }
    if (chartPeriod === 'year') {
        chartData = dashboardData.yearly_revenue
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>
                Dashboard
            </h1>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>💰 Дохід сьогодні</h3>
                    <strong>
                        {Number(
                            dashboardData.today_income
                        ).toLocaleString('uk-UA')} грн
                    </strong>
                </div>

                <div className={styles.card}>
                    <h3>📅 Записів сьогодні</h3>
                    <strong>
                            {dashboardData.bookings_today}
                    </strong>
                </div>

                <div className={styles.card}>
                    <h3>📈 Дохід за місяць</h3>
                    <strong>
                        {Number(
                            dashboardData.month_income
                        ).toLocaleString('uk-UA')} грн
                    </strong>
                </div>

                <div className={styles.card}>
                    <h3>🧾 Середній чек</h3>
                    <strong>
                        {Math.round(
                            dashboardData.average_check
                        )} грн
                    </strong>
                </div>
            </div>

            <div className={styles.secondaryGrid}>
                <div className={styles.smallCard}>
                    <span>Очікують</span>
                    <strong>
                        {dashboardData.pending_bookings}
                    </strong>
                </div>

                <div className={styles.smallGrid}>
                    <span>Виконано</span>
                    <strong>
                        {dashboardData.completed_bookings}
                    </strong>
                </div>

                <div className={styles.smallGrid}>
                    <span>Клієнтів</span>
                    <strong>
                        {dashboardData.total_clients}
                    </strong>
                </div>

                <div className={styles.smallGrid}>
                    <span>Авто</span>
                    <strong>
                        {dashboardData.total_cars}
                    </strong>
                </div>
            </div>

            <div className={styles.chartHeader}>
                <h2>Дохід</h2>
                <div className={styles.periodButtons}>
                    <button
                        onClick={() => setChartPeriod('week')}
                        className={
                            chartPeriod === 'week'
                                ? styles.activeButton
                                : ''
                        }
                    >
                        7 днів
                    </button>

                    <button
                        onClick={() => setChartPeriod('month')}
                        className={
                            chartPeriod === 'month'
                                ? styles.activeButton
                                : ''
                        }
                    >
                        30 днів
                    </button>

                    <button
                        onClick={() => setChartPeriod('year')}
                        className={
                            chartPeriod === 'year'
                                ? styles.activeButton
                                : ''
                        }
                    >
                        12 місяців
                    </button>
                </div>
                <RevenueChart
                    data={chartData}
                />
            </div>

            <div className={styles.bottomGrid}>
                <div className={styles.table}>
                    <h2>Останні записи</h2>
                    <RecentBookingTable
                        bookings={
                            dashboardData.recent_bookings
                        }
                    />
                </div>

                <TopServicesCard
                    services={
                        dashboardData.top_services
                    }
                />

                <TopClientsCard
                    clients={dashboardData.top_clients}
                />
            </div>
            <StatusPieChart
                pending={dashboardData.pending_bookings}
                confirmed={dashboardData.confirmed_bookings}
                completed={dashboardData.completed_bookings}
                cancelled={dashboardData.cancelled_bookings}
            />
        </div>
    )
}

export default AdminDashboardPage