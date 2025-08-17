import React from "react";
import { useApp } from "@/contexts/AppContext";
import { IssueCard } from "@/components/IssueCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export const Home: React.FC = () => {
  const { issues, announcements } = useApp();
  
  const urgentIssues = issues.filter(issue => issue.isUrgent);
  const recentIssues = issues.slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 2);
  
  const stats = {
    total: issues.length,
    urgent: urgentIssues.length,
    inProgress: issues.filter(i => i.status === "In Progress").length,
    resolved: issues.filter(i => i.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-content mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="h-64 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBanner})` }}
          >
            <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">
                  Welcome to Setshaba Connect
                </h1>
                <p className="text-xl opacity-90">
                  Bridging the gap between citizens and government
                </p>
                <Button asChild variant="civic" size="lg" className="mt-4">
                  <Link to="/report">Report an Issue</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="h-8 w-8 text-status-reported mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Issues</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="flex items-center p-4">
              <Clock className="h-8 w-8 text-urgent mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.urgent}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="flex items-center p-4">
              <TrendingUp className="h-8 w-8 text-status-progress mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="flex items-center p-4">
              <CheckCircle className="h-8 w-8 text-success mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Issues Alert */}
        {urgentIssues.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-urgent flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent Issues
              </h2>
              <Badge variant="destructive" className="bg-urgent">
                {urgentIssues.length} Active
              </Badge>
            </div>
            <div className="grid gap-4">
              {urgentIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Announcements */}
        {recentAnnouncements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest Updates</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/announcements">View All</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {recentAnnouncements.map(announcement => (
                <Card key={announcement.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      {announcement.isUrgent && (
                        <Badge variant="destructive" className="bg-urgent">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{announcement.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(announcement.publishedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Issues</h2>
            <Button asChild variant="civic" size="sm">
              <Link to="/issues">View All Issues</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {recentIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-civic">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="civic" className="h-auto p-4">
              <Link to="/report" className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-8 w-8" />
                <span>Report an Issue</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/events" className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8" />
                <span>View Events</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4">
              <Link to="/feedback" className="flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8" />
                <span>Give Feedback</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};