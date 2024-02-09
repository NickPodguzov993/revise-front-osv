import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        console.log('protected')
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return children;
};