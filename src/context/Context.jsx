import {createContext, useState, useEffect} from "react";
import { getProjects, getCertificates } from '../api/admin.api.js'

export const Context = createContext();

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [certificates, setCertificates] = useState([]);
    console.log('ContextProvider user:', user); // Debugging line to check the user state
    // console.log(certificates)
    const fetchAllData = async () => {
        const projects = await getProjects()
        const certificates = await getCertificates()
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
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;