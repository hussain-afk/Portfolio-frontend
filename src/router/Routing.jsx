import { Routes, Route, Navigate } from 'react-router-dom'
import MainPortfolioPAge from '../ui/portfolio/pages/MainPage'
import AdminLoginPage from '../ui/admin/LoginPage'
import AdminMainPage from '../ui/admin/pages/MainPage'
import { useContext } from 'react'
import { Context } from '../context/Context.jsx'
import dotenv from 'dotenv'
dotenv.config()

const Routing = () => {
    const AdminProtectedRoute = ({ children }) => {
        const { user } = useContext(Context)

        if (!user) {
            return <Navigate to="/admin/login" replace />;
        }
        if (user.email !== process.env.ADMIN_EMAIL) {
            return <Navigate to="/admin/login" replace />;
        }

        return children
    }
    return (
        <Routes>
            <Route path="/" element={<MainPortfolioPAge />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminMainPage /></AdminProtectedRoute>} />
        </Routes>
    )
}
export default Routing