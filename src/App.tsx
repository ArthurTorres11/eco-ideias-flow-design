import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import NewIdeaPage from "./pages/NewIdeaPage";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageIdeas from "./pages/admin/ManageIdeas";
import EvaluateIdea from "./pages/admin/EvaluateIdea";
import ManageUsers from "./pages/admin/ManageUsers";
import UserForm from "./pages/admin/UserForm";
import Settings from "./pages/admin/Settings";
import GoalsSettings from "./pages/admin/GoalsSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { IdeasProvider } from "./contexts/IdeasContext";

// Create a stable QueryClient instance with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IdeasProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserRoute>
                    <DashboardPage />
                  </UserRoute>
                </ProtectedRoute>
              } />
              <Route path="/new-idea" element={
                <ProtectedRoute>
                  <UserRoute>
                    <NewIdeaPage />
                  </UserRoute>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="ideas" element={<ManageIdeas />} />
                <Route path="ideas/:ideaId/evaluate" element={<EvaluateIdea />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="users/:userId/edit" element={<UserForm />} />
                <Route path="users/new" element={<UserForm />} />
                <Route path="goals" element={<GoalsSettings />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </IdeasProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;