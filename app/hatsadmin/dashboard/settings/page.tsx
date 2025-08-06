import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Store, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail,
  Save,
  Upload,
  Camera,
  Key,
  Users,
  Package,
  Truck,
  Plus
} from "lucide-react"

function SettingsActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        size="sm"
        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        Reset to Default
      </Button>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your store configuration and preferences"
        showSearch={true}
        showFilters={true}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:block">General</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:block">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:block">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:block">Security</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:block">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:block">Shipping</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Store Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Store Information
                    </CardTitle>
                    <CardDescription>
                      Basic information about your store
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input id="store-name" defaultValue="JSEvenour Hats" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Description</Label>
                      <Textarea 
                        id="store-description" 
                        defaultValue="Premium quality hats and accessories for every occasion"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Contact Email</Label>
                      <Input id="store-email" type="email" defaultValue="contact@jsevenourhats.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Phone Number</Label>
                      <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </CardContent>
                </Card>

                {/* Store Logo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Store Logo
                    </CardTitle>
                    <CardDescription>
                      Upload your store logo (recommended size: 200x200px)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Current Logo</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Logo
                    </Button>
                  </CardContent>
                </Card>

                {/* Business Address */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Business Address
                    </CardTitle>
                    <CardDescription>
                      Your business address for legal and shipping purposes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input id="address-line1" defaultValue="123 Fashion Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address-line2">Address Line 2</Label>
                      <Input id="address-line2" defaultValue="Suite 100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input id="zip" defaultValue="10001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payments" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Configure accepted payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Credit Cards</Label>
                        <p className="text-sm text-gray-500">Accept Visa, Mastercard, AMEX</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>PayPal</Label>
                        <p className="text-sm text-gray-500">Accept PayPal payments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Apple Pay</Label>
                        <p className="text-sm text-gray-500">Accept Apple Pay</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Google Pay</Label>
                        <p className="text-sm text-gray-500">Accept Google Pay</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Currency Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Currency Settings</CardTitle>
                    <CardDescription>
                      Set your store's primary currency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Primary Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">GBP - British Pound</SelectItem>
                          <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Multi-currency Support</Label>
                        <p className="text-sm text-gray-500">Allow customers to view prices in their local currency</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure when and how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Orders</Label>
                      <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when products are running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Customer Messages</Label>
                      <p className="text-sm text-gray-500">Get notified of customer inquiries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-gray-500">Receive marketing tips and updates</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Password Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Password Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account password and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="w-full">Update Password</Button>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Additional security options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15m</SelectItem>
                          <SelectItem value="30">30m</SelectItem>
                          <SelectItem value="60">1h</SelectItem>
                          <SelectItem value="120">2h</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme & Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your admin panel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sidebar Auto-collapse</Label>
                      <p className="text-sm text-gray-500">Automatically collapse sidebar on smaller screens</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-gray-500">Use compact spacing throughout the interface</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping */}
            <TabsContent value="shipping" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Shipping Zones */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Zones
                    </CardTitle>
                    <CardDescription>
                      Configure shipping areas and rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Domestic Shipping</Label>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">United States</span>
                          <Badge variant="secondary">$5.99</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Standard delivery 3-5 business days</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>International Shipping</Label>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Worldwide</span>
                          <Badge variant="secondary">$15.99</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">International delivery 7-14 business days</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shipping Zone
                    </Button>
                  </CardContent>
                </Card>

                {/* Shipping Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Settings</CardTitle>
                    <CardDescription>
                      General shipping configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="free-shipping-threshold">Free Shipping Threshold</Label>
                      <Input id="free-shipping-threshold" defaultValue="$75.00" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Calculate Shipping Tax</Label>
                        <p className="text-sm text-gray-500">Include tax in shipping calculations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Shipping Insurance</Label>
                        <p className="text-sm text-gray-500">Offer shipping insurance option</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
