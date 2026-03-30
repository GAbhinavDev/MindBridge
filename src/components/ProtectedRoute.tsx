import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ngo_admin" | "peer_leader";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (requiredRole && !roles.includes(requiredRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
