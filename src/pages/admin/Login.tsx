import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Shield, LogIn } from "lucide-react";

export const Login: React.FC = () => {
  const { toast } = useToast();
  const { setIsAdmin } = useApp();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    setIsAdmin(true);
    toast({
      title: "Admin Access Granted",
      description: "Welcome to the admin dashboard.",
    });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Click below to access the administrative dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAdminLogin} className="w-full" size="lg">
            <LogIn className="h-4 w-4 mr-2" />
            Enter Admin Dashboard
          </Button>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Mode:</strong><br />
              One-click access for demonstration purposes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};