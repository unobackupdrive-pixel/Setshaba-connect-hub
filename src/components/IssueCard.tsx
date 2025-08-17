import React from "react";
import { Issue, categoryIcons, statusColors } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showProgress?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onClick,
  showProgress = true 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        issue.isUrgent ? 'border-urgent shadow-urgent animate-fade-in' : 'shadow-card'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[issue.category]}</span>
            <div>
              <CardTitle className={`text-lg ${issue.isUrgent ? 'text-urgent' : ''}`}>
                {issue.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{issue.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button 
              variant="status" 
              size="sm"
              className={`border-${statusColors[issue.status]} text-${statusColors[issue.status]}`}
            >
              {issue.status}
            </Button>
            {issue.isUrgent && (
              <Badge variant="destructive" className="bg-urgent">
                Urgent
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{issue.description}</p>
        
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{issue.progress}%</span>
            </div>
            <Progress 
              value={issue.progress} 
              className="h-2"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Reported {formatDate(issue.reportedAt)} at {formatTime(issue.reportedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};