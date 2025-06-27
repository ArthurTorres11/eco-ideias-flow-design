
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-idea" element={<NewIdeaPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="ideas" element={<ManageIdeas />} />
            <Route path="ideas/:ideaId/evaluate" element={<EvaluateIdea />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="users/:userId/edit" element={<UserForm />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
