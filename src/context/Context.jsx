import {createContext, useState, useEffect} from "react";
import { getProjects, getCertificates, getMessages } from '../api/admin.api.js'

export const Context = createContext();

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [messages, setMessages] = useState([]);
    console.log('ContextProvider messages:', messages); // Debugging line to check the user state
    console.log('ContextProvider user:', user); // Debugging line to check the user state
    // console.log(certificates)
    const fetchAllData = async () => {
        const projects = await getProjects()
        const certificates = await getCertificates()
        const messages = await getMessages()
        setMessages(messages)
        setProjects(projects)
        setCertificates(certificates)

    }
    useEffect(() => {
        fetchAllData()
    }, [])
    // console.log('ContextProvider user:', user); // Debugging line to check the user state
    return (
        <Context.Provider value={{
            user,
            setUser,

            projects,
            setProjects,

            certificates,
            setCertificates,

            messages,
            setMessages
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;