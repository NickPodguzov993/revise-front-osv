import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";

const AuthContext = createContext<CProps>({});

interface IProps {
 children: ReactNode
}

interface CProps {
        loginAuth?: (data: string) => void;
        logout?: () => void;
}

export const AuthProvider = ({ children }: IProps) => {
    const navigate = useNavigate()

    // call this function when you want to authenticate the user
    const loginAuth = (data) => {
        localStorage.setItem('access_token', data);
        navigate("/home");
    };


    const logout = () => {
        localStorage.clear()
        navigate("/", { replace: true });
    };

    const value = {
            loginAuth,
            logout,
        }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
