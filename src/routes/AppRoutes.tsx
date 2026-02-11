import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "../components/common/Loader";
import ErrorBoundary from "../components/common/ErrorBoundary";
import ScrollToTop from "../components/common/ScrollToTop";

const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CreateTest = lazy(() => import("../pages/CreateTest"));
const AddQuestions = lazy(() => import("../pages/AddQuestions"));
const TestPublish = lazy(() => import("../pages/TestPublish"));

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-test" element={<CreateTest />} />
              <Route
                path="/create-test/:testId/edit"
                element={<CreateTest />}
              />
              <Route
                path="/create-test/:testId/questions"
                element={<AddQuestions />}
              />
              <Route
                path="/create-test/:testId/publish"
                element={<TestPublish />}
              />
            </Route>
          </Route>

          {/*Route Not Found : 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
