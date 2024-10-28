import { createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children, auth, setAuth }) => {
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;