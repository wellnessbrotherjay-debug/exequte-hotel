import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Checkout from "@/pages/Checkout";
import CheckEmail from "@/pages/CheckEmail";
import WelcomeProgram from "@/pages/WelcomeProgram";
import Success from "@/pages/Success";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import AppDashboardPage from "@/pages/AppDashboardPage";
import CompanyHomePage from "@/pages/CompanyHomePage";
import CompanyDataPage from "@/pages/CompanyDataPage";
import CompanyAnalysisPage from "@/pages/CompanyAnalysisPage";
import CompanyReportsPage from "@/pages/CompanyReportsPage";
import CompanyForecastPage from "@/pages/CompanyForecastPage";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import RequireAuth from "@/components/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/welcome-program" element={<WelcomeProgram />} />
        <Route path="/success" element={<Success />} />

        {/* Auth + analytics workspace */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id"
          element={
            <RequireAuth>
              <CompanyHomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id/data"
          element={
            <RequireAuth>
              <CompanyDataPage />
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id/analysis"
          element={
            <RequireAuth>
              <CompanyAnalysisPage />
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id/reports"
          element={
            <RequireAuth>
              <CompanyReportsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/company/:id/forecast"
          element={
            <RequireAuth>
              <CompanyForecastPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ Toast notifications available everywhere */}
      <Toaster />
    </AuthProvider>
  );
}
