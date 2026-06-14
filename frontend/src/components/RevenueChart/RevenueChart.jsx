import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

function RevenueChart({ data }) {
    return (
        <ResponsiveContainer
            width='100%'
            height={350}
        >
            <LineChart data={data}>
                <XAxis dataKey='label' />
                <YAxis />
                <Tooltip />
                <Line
                    type='monotone'
                    dataKey='revenue'
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default RevenueChart