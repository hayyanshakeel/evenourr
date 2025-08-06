"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { HiPlus } from "react-icons/hi2"

interface AddCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (collection: any) => void
}

export function AddCollectionModal({ isOpen, onClose, onSave }: AddCollectionModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    collectionType: "manual",
    published: true,
    seoTitle: "",
    seoDescription: "",
    image: null as File | null
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
    
    onSave(collectionData)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      handle: "",
      collectionType: "manual",
      published: true,
      seoTitle: "",
      seoDescription: "",
      image: null
    })
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <HiPlus className="h-5 w-5 text-blue-600" />
            Create New Collection
          </DialogTitle>
          <DialogDescription>
            Create a new product collection to organize your products into themed groups.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Collection Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Summer Collection, Best Sellers"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your collection..."
                    className="mt-1 min-h-[100px]"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="handle" className="text-sm font-medium">URL Handle</Label>
                  <Input
                    id="handle"
                    value={formData.handle}
                    onChange={(e) => handleInputChange("handle", e.target.value)}
                    placeholder="url-friendly-name"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used in the collection URL. Auto-generated from title if left empty.
                  </p>
                </div>
              </div>
            </div>

            {/* Collection Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Collection Settings</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="collectionType" className="text-sm font-medium">Collection Type</Label>
                  <Select 
                    value={formData.collectionType} 
                    onValueChange={(value: string) => handleInputChange("collectionType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual - Add products manually</SelectItem>
                      <SelectItem value="automatic">Automatic - Set conditions to auto-add products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Publish Collection</Label>
                    <p className="text-xs text-gray-500">
                      Published collections are visible on your storefront
                    </p>
                  </div>
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange("published", checked)}
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="seoTitle" className="text-sm font-medium">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                    placeholder="SEO-optimized title for search engines"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription" className="text-sm font-medium">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                    placeholder="Meta description for search engines (160 characters max)"
                    className="mt-1"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
