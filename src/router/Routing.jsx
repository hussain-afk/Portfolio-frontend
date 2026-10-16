import { lazy, Suspense, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Context } from '../context/Context.jsx'

const MainPortfolioPage = lazy(() => import('../ui/portfolio/pages/MainPage'))
const AdminLoginPage = lazy(() => import('../ui/admin/LoginPage'))
const AdminMainPage = lazy(() => import('../ui/admin/pages/MainPage'))
// const Loader = lazy(() => import('../ui/Loader.jsx'))
import Loader from '../ui/Loader.jsx'

// const RouteFallback = () => (
//     <div
//         role="status"
//         aria-live="polite"
//         style={{
//             minHeight: '100vh',
//             display: 'grid',
//             placeItems: 'center',
//             padding: '24px',
//             color: '#94a3b8',
//             background: '#0b1018',
//             fontFamily: 'Inter, system-ui, sans-serif',
//         }}
//     >
//         Loading portfolio...
//     </div>
// )

const AdminProtectedRoute = ({ children }) => {
        const { user } = useContext(Context)

        if (!user) {
            return <Navigate to="/admin/login" replace />;
        }
        if (user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
            return <Navigate to="/admin/login" replace />;
        }

        return children
}

const Routing = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<MainPortfolioPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminMainPage /></AdminProtectedRoute>} />
            </Routes>
        </Suspense>
    )
}
export default Routing