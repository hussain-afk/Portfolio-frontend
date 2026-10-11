import { login, addProject, addCertificate, sendMessage } from '../api/admin.api.js'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../context/Context.jsx'

const useAdmin = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(Context);
    const handleAdminLogin = async (email, password) => {
        let response;
        try {
            response = await login(email, password);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }

        setUser(response);
        navigate('/admin', { replace: true });
        return response;
    };
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
    const handleSendMessage = async (messageData) => {
        try {
            const response = await sendMessage(messageData);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    }
    return { handleAdminLogin, handleAddProject, handleAddCertificate, handleSendMessage }
}
export default useAdmin