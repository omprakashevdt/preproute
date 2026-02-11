import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
