import {createContext, ReactNode, useContext, useMemo} from "react";
//import { useNavigate } from "react-router-dom";
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
    loginAuth?: (data: string) => void;
    logout?: () => void;
}

export const AuthProvider = ({ children }: IProps) => {
    const [user, setUser] = useLocalStorage("user");
   // const navigate = useNavigate();

   /* const data = {
        user: 'user', password:'password'
    }*/

    // call this function when you want to authenticate the user
    const loginAuth =  (data:string) => {
        console.log(123)
        setUser(data);
     //   navigate("/home");
    };


    /*const logout = () => {
        setUser(null);
     //   navigate("/", { replace: true });
    };*/

    const value = useMemo(
        () => ({
            user,
            loginAuth,
           // logout,
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};


