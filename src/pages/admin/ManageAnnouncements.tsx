import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Megaphone, AlertTriangle } from "lucide-react";

export const ManageAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    isUrgent: false
  });

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const announcement = {
      title: newAnnouncement.title,
      description: newAnnouncement.description,
      isUrgent: newAnnouncement.isUrgent,
      publishedAt: new Date().toISOString()
    };

    addAnnouncement(announcement);
    setNewAnnouncement({ title: "", description: "", isUrgent: false });
    setIsDialogOpen(false);
    
    toast({
      title: "Announcement Published",
      description: "Your announcement has been published successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Post Updates</h1>
            <p className="text-muted-foreground">Create and manage community announcements</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Share important updates with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed announcement content"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent"
                    checked={newAnnouncement.isUrgent}
                    onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isUrgent: checked }))}
                  />
                  <Label htmlFor="urgent" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-urgent" />
                    Mark as urgent
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAnnouncement}>
                    Publish Announcement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements</h3>
                <p className="text-muted-foreground text-center">
                  Create your first announcement to share updates with the community.
                </p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Published on {formatDate(announcement.publishedAt)}
                      </CardDescription>
                    </div>
                    {announcement.isUrgent && (
                      <Badge variant="destructive" className="bg-urgent">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{announcement.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};