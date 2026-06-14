import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} 
from 'recharts'

import styles from './StatusPieChart.module.css'

const COLORS = [
    '#f59e0b', //pending
    '#0ea5e9', //confirmed
    '#22c55e', //completed
    '#ef4444', //cancelled
]

function StatusPieChart({pending, confirmed, completed, cancelled}) {
    const data = [
        {
            name: 'Очікує',
            value: pending,
        },
        {
            name: 'Підтверджено',
            value: confirmed,
        },
        {
            name: 'Виконано',
            value: completed,
        },
        {
            name: 'Скасовано',
            value: cancelled,
        },
    ]

    return (
        <div className={styles.card}>
            <h2>📊 Статуси записів</h2>
            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey='value'
                        nameKey='name'
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default StatusPieChart