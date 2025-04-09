import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const user = useMemo(() => ({
    name: "Default Name",
    email: "default@email.com",
  }), []);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with current user data
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both context and mock API
      // Update user data (currently unused, consider using it or remove this block)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        initials: formData.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
      };
      console.log("Updated user:", updatedUser); 

      // setUser(updatedUser); 
      toast.success("Profile updated successfully");

     
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteAccount = () => {
    toast.warning(
      "Account deletion requested - this would trigger a confirmation dialog in production"
    );
   
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-primary dark:text-dark-primary">
        Settings
      </h1>

      {/* Profile Settings */}
      <Card className="border-border dark:border-dark-border">
        <CardHeader>
          <CardTitle className="text-primary dark:text-dark-primary">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground dark:text-dark-foreground">
              Name
            </Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="bg-background dark:bg-dark-card"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground dark:text-dark-foreground">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="bg-background dark:bg-dark-card"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="border-border dark:border-dark-border">
        <CardHeader>
          <CardTitle className="text-primary dark:text-dark-primary">
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label className="text-foreground dark:text-dark-foreground">
              Dark Mode
            </Label>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-teal-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive dark:border-dark-destructive">
        <CardHeader>
          <CardTitle className="text-destructive dark:text-dark-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="bg-destructive hover:bg-destructive/90 dark:bg-dark-destructive dark:hover:bg-dark-destructive/90"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
