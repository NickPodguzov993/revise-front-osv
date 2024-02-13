import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: IProps) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
