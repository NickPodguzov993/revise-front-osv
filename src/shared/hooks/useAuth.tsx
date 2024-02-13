import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";

const AuthContext = createContext<CProps>({});

interface IProps {
 children: ReactNode
}

interface userData {
    username: string;
}

interface CProps {
        user?: userData;
        loginAuth?: (data: unknown) => Promise<void>;
        logout?: () => void;
}

export const AuthProvider = ({ children }: IProps) => {
    const [user, setUser] = useLocalStorage("user", '');
    const navigate = useNavigate()

    // call this function when you want to authenticate the user
    const loginAuth = async (data: unknown) => {
        setUser(data);
        navigate("/home");
    };


    const logout = () => {
        setUser(null);
        localStorage.clear()
        navigate("/", { replace: true });
    };

    const value = {
            user,
            loginAuth,
            logout,
        }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
