import { login, addProject, addCertificate } from '../api/admin.api.js'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../context/Context.jsx'

const useAdmin = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(Context);
    const handleAdminLogin = async (username, password) => {
        try {
            const response = await login(username, password);
            setUser(response);
            navigate('/admin'); // Navigate to the admin page after successful login
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }
    const handleAddProject = async (projectData) => {
        try {
            const response = await addProject(projectData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add project');
        }
    }
    const handleAddCertificate = async (certificateData) => {
        try {
            const response = await addCertificate(certificateData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add certificate');
        }
    }
    return { handleAdminLogin, handleAddProject, handleAddCertificate }
}
export default useAdmin