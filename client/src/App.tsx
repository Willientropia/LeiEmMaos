import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import NewsDetail from "@/pages/news-detail";
import AdminDashboard from "@/pages/admin/dashboard";
import NewsManagement from "@/pages/admin/news-management";
import CommentModeration from "@/pages/admin/comment-moderation";
import PoliticianDashboard from "@/pages/politician/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/news" component={NewsManagement} />
      <Route path="/admin/comments" component={CommentModeration} />
      <Route path="/politician/dashboard" component={PoliticianDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
