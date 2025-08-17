import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Category, Status, categoryIcons } from "@/data/mockData";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

export const ManageIssues: React.FC = () => {
  const { issues, updateIssue, addIssue } = useApp();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [newIssue, setNewIssue] = useState({
    title: "",
    category: "",
    location: "",
    description: ""
  });

  const handleAddIssue = () => {
    if (!newIssue.title || !newIssue.category || !newIssue.location || !newIssue.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const issue = {
      title: newIssue.title,
      category: newIssue.category as Category,
      location: newIssue.location,
      description: newIssue.description,
      status: "Reported" as const,
      progress: 0,
      timeline: [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: "Created by admin"
      }],
      isUrgent: newIssue.category === "Water" || newIssue.title.toLowerCase().includes("burst"),
      reportedBy: "Admin",
      reportedAt: new Date().toISOString()
    };

    addIssue(issue);
    setNewIssue({ title: "", category: "", location: "", description: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Issue Added",
      description: "New issue has been created successfully.",
    });
  };

  const handleUpdateIssue = () => {
    if (!selectedIssue) return;

    const progressMap = {
      "Reported": 0,
      "In Progress": 50,
      "Resolved": 100
    };

    updateIssue(selectedIssue.id, {
      status: selectedIssue.status,
      progress: progressMap[selectedIssue.status as Status]
    });

    setIsEditDialogOpen(false);
    setSelectedIssue(null);
    
    toast({
      title: "Issue Updated",
      description: "Issue status has been updated successfully.",
    });
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Reported": return "bg-blue-500";
      case "In Progress": return "bg-yellow-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Issues</h1>
            <p className="text-muted-foreground">View and manage all community issues</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Issue</DialogTitle>
                <DialogDescription>
                  Create a new community issue report
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newIssue.category} onValueChange={(value) => setNewIssue(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Water">💧 Water</SelectItem>
                      <SelectItem value="Electricity">⚡ Electricity</SelectItem>
                      <SelectItem value="Roads">🚧 Roads</SelectItem>
                      <SelectItem value="Waste">🗑️ Waste</SelectItem>
                      <SelectItem value="Other">❓ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newIssue.location}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Street address or area"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the issue"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddIssue}>
                    Add Issue
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Issues</CardTitle>
            <CardDescription>
              Manage and track all community issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {issue.isUrgent && <AlertTriangle className="h-4 w-4 text-urgent" />}
                        <span className="font-medium">{issue.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{categoryIcons[issue.category]}</span>
                        {issue.category}
                      </div>
                    </TableCell>
                    <TableCell>{issue.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-2 ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={issue.progress} className="w-16" />
                        <span className="text-sm text-muted-foreground">{issue.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Issue Status</DialogTitle>
              <DialogDescription>
                Change the status and progress of this issue
              </DialogDescription>
            </DialogHeader>
            {selectedIssue && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedIssue.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedIssue.location}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedIssue.status} 
                    onValueChange={(value) => setSelectedIssue(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reported">Reported</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateIssue}>
                    Update Issue
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};