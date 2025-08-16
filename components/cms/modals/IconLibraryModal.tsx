"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";

interface IconLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIcon: (iconName: string, iconComponent: React.ReactNode) => void;
}

export default function IconLibraryModal({ open, onOpenChange, onSelectIcon }: IconLibraryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customIconUrl, setCustomIconUrl] = useState("");

  // Get all Lucide icons (forwardRef components are objects, not functions)
  const lucideIconNames = Object.keys(LucideIcons).filter((name) => {
    if (name === 'createLucideIcon' || name === 'default') return false;
    const exp = (LucideIcons as any)[name];
    const isRenderableComponent =
      typeof exp === 'function' ||
      (exp && typeof exp === 'object' && ('render' in exp || 'displayName' in exp));
    // Keep standard PascalCase icon exports only
    const isPascal = /^[A-Z][A-Za-z0-9]+$/.test(name);
    return isRenderableComponent && isPascal;
  });

  const filteredIcons = lucideIconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      onSelectIcon(iconName, <IconComponent className="w-5 h-5" />);
      onOpenChange(false);
    }
  };

  const handleCustomIconSelect = () => {
    if (customIconUrl.trim()) {
      onSelectIcon('custom', <img src={customIconUrl} alt="Custom icon" className="w-5 h-5" />);
      setCustomIconUrl("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle>Icon Library</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="lucide" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lucide">Icon Library</TabsTrigger>
            <TabsTrigger value="custom">Custom Icons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lucide" className="space-y-4">
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            />
            
            <div className="grid grid-cols-8 gap-3 max-h-96 overflow-y-auto">
              {filteredIcons.slice(0, 200).map((iconName) => {
                const IconComponent = (LucideIcons as any)[iconName];
                const element = React.createElement(IconComponent as any, { className: 'w-6 h-6 mb-2 text-gray-900' });
                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-900"
                    title={iconName}
                  >
                    {element}
                    <span className="text-xs text-gray-800 truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Icon URL</label>
                <Input
                  placeholder="https://example.com/icon.svg"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                />
              </div>
              
              {customIconUrl && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Preview:</span>
                  <img src={customIconUrl} alt="Preview" className="w-6 h-6" />
                </div>
              )}
              
              <Button onClick={handleCustomIconSelect} disabled={!customIconUrl.trim()}>
                Use Custom Icon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}