import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: IProps) => {
  if (!localStorage.getItem('access_token')) {
    return <Navigate to="/" />;
  }

  return children;
};
