import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { NavBar } from "@/components/NavBar";
import { Home } from "@/pages/citizen/Home";
import { Issues } from "@/pages/citizen/Issues";
import { Report } from "@/pages/citizen/Report";
import { Events } from "@/pages/citizen/Events";
import { Feedback } from "@/pages/citizen/Feedback";
import { Login } from "@/pages/admin/Login";
import { Dashboard } from "@/pages/admin/Dashboard";
import { ManageIssues } from "@/pages/admin/ManageIssues";
import { ManageAnnouncements } from "@/pages/admin/ManageAnnouncements";
import { ManageEvents } from "@/pages/admin/ManageEvents";
import { ManageFeedback } from "@/pages/admin/ManageFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/report" element={<Report />} />
            <Route path="/events" element={<Events />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/issues" element={<ManageIssues />} />
            <Route path="/admin/announcements" element={<ManageAnnouncements />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/feedback" element={<ManageFeedback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
