import { statusLabels } from '../../utils/statusLabels'

function RecentBookingsTable({
    bookings,
}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Клієнт</th>
                    <th>Сервіси</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Вартість</th>
                </tr>
            </thead>

            <tbody>
                {bookings.map(
                    (booking) => (
                        <tr key={booking.id}>
                            <td>{booking.client}</td>
                            <td>{booking.service}</td>
                            <td>{booking.date}</td>
                            <td>{statusLabels[booking.status]}</td>
                            <td>{booking.price}</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    )
}

export default RecentBookingsTable