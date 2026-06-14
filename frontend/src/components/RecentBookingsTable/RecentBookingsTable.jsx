function RecentBookingsTable({
    bookings,
}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Price</th>
                </tr>
            </thead>

            <tbody>
                {bookings.map(
                    (booking) => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.client}</td>
                            <td>{booking.service}</td>
                            <td>{booking.date}</td>
                            <td>{booking.status}</td>
                            <td>{booking.price}</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    )
}

export default RecentBookingsTable