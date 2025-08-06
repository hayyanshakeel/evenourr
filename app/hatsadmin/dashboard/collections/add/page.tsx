"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HiArrowLeft, HiPhoto } from "react-icons/hi2"

export default function AddCollectionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    collectionType: "manual",
    published: true,
    seoTitle: "",
    seoDescription: "",
    visibility: "public",
    sortOrder: "manual"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate handle from title if not provided
    const handle = formData.handle || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const collectionData = {
      ...formData,
      handle,
      id: Date.now().toString(),
      productCount: 0,
      createdAt: new Date().toISOString()
    }
    
    console.log("Creating collection:", collectionData)
    router.push("/hatsadmin/dashboard/collections")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate handle from title
    if (field === "title" && typeof value === "string") {
      const autoHandle = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        handle: autoHandle
      }))
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <PageHeader 
        title="Create Collection" 
        subtitle="Organize products into themed collections"
      >
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="gap-2"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Collection Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Summer Collection, Best Sellers"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your collection and what makes it special..."
                      className="mt-2 min-h-[120px]"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="handle" className="text-sm font-medium">URL Handle</Label>
                    <Input
                      id="handle"
                      value={formData.handle}
                      onChange={(e) => handleInputChange("handle", e.target.value)}
                      placeholder="url-friendly-name"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be used in the collection URL. Auto-generated from title if left empty.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Collection Type & Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="collectionType" className="text-sm font-medium">Collection Type</Label>
                    <Select 
                      value={formData.collectionType} 
                      onValueChange={(value: string) => handleInputChange("collectionType", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual - Add products manually</SelectItem>
                        <SelectItem value="automatic">Automatic - Set conditions to auto-add products</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.collectionType === "manual" 
                        ? "You'll manually choose which products to include in this collection." 
                        : "Products will be automatically added based on conditions you set."
                      }
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="sortOrder" className="text-sm font-medium">Sort Order</Label>
                    <Select 
                      value={formData.sortOrder} 
                      onValueChange={(value: string) => handleInputChange("sortOrder", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="best-selling">Best Selling</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                        <SelectItem value="price-low-high">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high-low">Price (High to Low)</SelectItem>
                        <SelectItem value="newest">Date Created (Newest First)</SelectItem>
                        <SelectItem value="oldest">Date Created (Oldest First)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Engine Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="seoTitle" className="text-sm font-medium">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                      placeholder="SEO-optimized title for search engines"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If left empty, the collection title will be used.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seoDescription" className="text-sm font-medium">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                      placeholder="Meta description for search engines (160 characters max)"
                      className="mt-2"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoDescription.length}/160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Published</Label>
                      <p className="text-xs text-gray-500">
                        Published collections are visible on your storefront
                      </p>
                    </div>
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange("published", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="visibility" className="text-sm font-medium">Visibility</Label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(value: string) => handleInputChange("visibility", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="hidden">Hidden - Not visible in navigation</SelectItem>
                        <SelectItem value="password">Password Protected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Collection Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <HiPhoto className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button type="button" variant="outline">
                        Upload Image
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This image will represent your collection on the storefront.
                  </p>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p><strong>URL:</strong> /collections/{formData.handle || 'your-collection'}</p>
                    <p><strong>Status:</strong> {formData.published ? 'Published' : 'Draft'}</p>
                    <p><strong>Type:</strong> {formData.collectionType === 'manual' ? 'Manual' : 'Automatic'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Collection
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
