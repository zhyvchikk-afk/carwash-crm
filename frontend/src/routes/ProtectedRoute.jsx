import { Navigate } from "react-router-dom";

import { useAuth } from '../contexts/AuthContext'


function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <p>Завантаження...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    return children
}

export default ProtectedRoute