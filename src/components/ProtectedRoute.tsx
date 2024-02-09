import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import {ReactNode} from "react";

interface IProps {
    children : ReactNode
}

export const ProtectedRoute = ({ children }:IProps) => {
    const { user } = useAuth();

    if (!user) {
        console.log('protected')
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return children;
};
