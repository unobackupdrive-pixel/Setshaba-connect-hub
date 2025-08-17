import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { Category } from "@/data/mockData";
import { Camera, Send, MapPin, Locate } from "lucide-react";

export const Report: React.FC = () => {
  const { toast } = useToast();
  const { addIssue } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    imageUrl: ""
  });
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get a proper address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const components = result.components;
              
              // Format address similar to existing data: "Street, City"
              let locationString = "";
              
              if (components.road) {
                locationString = components.road;
              } else if (components.suburb) {
                locationString = components.suburb;
              } else if (components.neighbourhood) {
                locationString = components.neighbourhood;
              }
              
              if (components.city) {
                locationString += locationString ? `, ${components.city}` : components.city;
              } else if (components.town) {
                locationString += locationString ? `, ${components.town}` : components.town;
              } else if (components.village) {
                locationString += locationString ? `, ${components.village}` : components.village;
              }
              
              // Fallback to formatted address if components don't give us what we need
              if (!locationString) {
                locationString = result.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
              }
              
              setFormData(prev => ({ ...prev, location: locationString }));
              toast({
                title: "Location Added",
                description: "Your current location has been added to the report.",
              });
            } else {
              throw new Error("No results found");
            }
          } else {
            throw new Error("Geocoding failed");
          }
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setFormData(prev => ({ ...prev, location: locationString }));
          toast({
            title: "Location Added",
            description: "Location coordinates have been added. You can edit this to be more specific.",
          });
        }
        
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please enter it manually.",
          variant: "destructive"
        });
      }
    );
  };

  const handlePhotoUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // This will prefer the camera on mobile devices
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you'd upload this to a server and get back a URL
        // For now, we'll create a local URL for demo purposes
        const localUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imageUrl: localUrl }));
        toast({
          title: "Photo Added",
          description: "Your photo has been attached to the report.",
        });
      }
    };
    
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.location || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newIssue = {
      title: formData.title,
      category: formData.category as Category,
      location: formData.location,
      description: formData.description,
      imageUrl: formData.imageUrl,
      status: "Reported" as const,
      progress: 0,
      timeline: [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: "Reported"
      }],
      reportedBy: "Citizen Report",
      reportedAt: new Date().toISOString()
    };

    addIssue(newIssue);
    
    const trackingId = `TR${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Report Submitted Successfully",
      description: `Your tracking ID is: ${trackingId}`,
    });

    // Reset form
    setFormData({
      title: "",
      category: "",
      location: "",
      description: "",
      imageUrl: ""
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <main className="max-w-content mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">Help us serve you better by reporting community issues</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit New Report
            </CardTitle>
            <CardDescription>
              Provide details about the issue you'd like to report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Category }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
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
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Street address or area"
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="flex items-center gap-2"
                  >
                    {isLocating ? (
                      <Locate className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {isLocating ? "Locating..." : "Use Location"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click "Use Location" to automatically add your current location
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Photo (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Photo URL or click camera to upload"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePhotoUpload}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Take a photo or upload from your device to help us understand the issue better
                </p>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Issue preview" 
                      className="w-full max-w-xs h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};