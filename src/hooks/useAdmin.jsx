import { login, addProject, addCertificate, sendMessage, addInWorkingProject } from '../api/admin.api.js'
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
            throw new Error(error.message || 'Login failed', { cause: error });
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
            throw new Error(error.message || 'Failed to add project', { cause: error });
        }
    }
    const handleAddCertificate = async (certificateData) => {
        try {
            const response = await addCertificate(certificateData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to add certificate', { cause: error });
        }
    }
    const handleAddInWorkingProject = async (projectData) => {
        try {
            const response = await addInWorkingProject(projectData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to add in working project', { cause: error });
        }
    }
    const handleSendMessage = async (messageData) => {
        try {
            const response = await sendMessage(messageData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to send message', { cause: error });
        }
    }
    return { handleAdminLogin, handleAddProject, handleAddCertificate, handleSendMessage, handleAddInWorkingProject }
}
export default useAdmin