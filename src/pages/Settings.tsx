
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserStore } from "@/stores/userStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from '@/hooks/useAuth';
import UserFormDialog from "@/components/settings/UserFormDialog";
import UserRolePermissionsDialog from "@/components/settings/UserRolePermissionsDialog";
import UserPermissionsDialog from "@/components/settings/UserPermissionsDialog";
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const generalSchema = z.object({
  pharmacyName: z.string().min(2, "Pharmacy name is required"),
  licenseNumber: z.string().min(2, "License number is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required")
});

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
};

const Settings = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam || 'general');
  const { currentUser } = useAuth();
  
  const { 
    users, deleteUser,
    getUserPermissions
  } = useUserStore();
  
  const {
    generalSettings,
    notificationSettings, 
    profileSettings,
    updateGeneralSettings,
    updateNotificationSettings,
    toggleNotificationSetting,
    toggleDarkMode,
    updateProfileSettings
  } = useSettingsStore();
  
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (data) {
            setUserProfile(data);
            setProfileData({
              firstName: data.name?.split(' ')[0] || "User",
              lastName: data.name?.split(' ')[1] || "",
              email: data.email || currentUser.email || "",
              role: data.role || "",
              phone: data.phone || "",
            });
          } else {
            // Fallback to user metadata
            setUserProfile({
              name: currentUser.user_metadata?.name || 'User',
              role: currentUser.user_metadata?.role || 'User'
            });
            setProfileData({
              firstName: currentUser.user_metadata?.name?.split(' ')[0] || "User",
              lastName: currentUser.user_metadata?.name?.split(' ')[1] || "",
              email: currentUser.email || "",
              role: currentUser.user_metadata?.role || "",
              phone: "",
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const generalForm = useForm<z.infer<typeof generalSchema>>({
    resolver: zodResolver(generalSchema),
    defaultValues: generalSettings
  });

  // Update form values when generalSettings changes
  useEffect(() => {
    generalForm.reset(generalSettings);
  }, [generalSettings]);

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    toggleNotificationSetting(key);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    
    toast({
      title: "Display Setting Changed",
      description: `Dark mode has been ${!profileSettings.darkMode ? "enabled" : "disabled"}.`,
    });
  };
  
  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 5) {
      updateProfileSettings({
        sessionTimeout: value
      });
    }
  };
  
  const onGeneralSubmit = (data: z.infer<typeof generalSchema>) => {
    updateGeneralSettings(data);
    
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };
  
  const handleViewRoles = (user) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };
  
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been successfully removed.`,
      });
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Check if current user is an admin
  const isAdmin = currentUser && userProfile?.role === "Administrator";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your pharmacy system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Pharmacy Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={generalForm.control}
                        name="pharmacyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pharmacy Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Address</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={generalForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                          control={generalForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={generalForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={generalForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profileData.role} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Update Profile</Button>
                  </div>
                </form>
                
                <Separator />
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Change Password</Button>
                  </div>
                </form>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the interface</p>
                    </div>
                    <Switch checked={profileSettings.darkMode} onCheckedChange={handleToggleDarkMode} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email} 
                      onCheckedChange={() => handleNotificationChange('email')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.push} 
                      onCheckedChange={() => handleNotificationChange('push')} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Security</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.twoFactor || false} 
                      onCheckedChange={() => handleNotificationChange('twoFactor')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Session Timeout (minutes)</h4>
                      <p className="text-sm text-muted-foreground">Set the session timeout duration</p>
                    </div>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      min="5"
                      value={profileSettings.sessionTimeout} 
                      onChange={handleSessionTimeoutChange}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Role</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Last Login</th>
                      <th className="h-10 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {users.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-2 align-middle">{user.name}</td>
                        <td className="p-2 align-middle">{user.email}</td>
                        <td className="p-2 align-middle">{user.role}</td>
                        <td className="p-2 align-middle">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                            user.status === 'active' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-2 align-middle">{user.lastLogin}</td>
                        <td className="p-2 align-middle text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewRoles(user)}
                              disabled={!isAdmin}
                            >
                              View Role
                            </Button>
                            {isAdmin && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditPermissions(user)}
                              >
                                Edit Permissions
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditUser(user)}
                              disabled={!isAdmin}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => handleDeleteUser(user)}
                              disabled={!isAdmin}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddUser} disabled={!isAdmin}>Add New User</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when inventory items fall below threshold
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.lowStock}
                    onCheckedChange={() => handleNotificationChange('lowStock')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <h4 className="font-medium">Expiry Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when products are close to expiration date
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.expiry}
                    onCheckedChange={() => handleNotificationChange('expiry')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <h4 className="font-medium">New E-Prescription Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when new digital prescriptions are received
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.ePrescription}
                    onCheckedChange={() => handleNotificationChange('ePrescription')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b py-4">
                  <div>
                    <h4 className="font-medium">Prescription Refill Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Send reminders for prescriptions due for refill
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.refill}
                    onCheckedChange={() => handleNotificationChange('refill')}
                  />
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify about system updates and maintenance
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={() => handleNotificationChange('systemUpdates')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Notification settings have been updated successfully.",
                  });
                }}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Form Dialog */}
      <UserFormDialog 
        open={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        user={selectedUser}
        isEdit={!!selectedUser}
      />
      
      {/* Role Permissions Dialog */}
      <UserRolePermissionsDialog
        open={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        userId={selectedUser?.id}
      />
      
      {/* Custom Permissions Dialog */}
      <UserPermissionsDialog
        open={isPermissionsDialogOpen}
        onClose={() => setIsPermissionsDialogOpen(false)}
        userId={selectedUser?.id}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
