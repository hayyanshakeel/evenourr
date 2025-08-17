"use client";

import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Palette, ChevronRight, Menu, User, ShoppingCart, Heart, Type, GripVertical, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import IconLibraryModal from "@/components/cms/modals/IconLibraryModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Header Item Icons mapping
const getItemIcon = (itemType: string) => {
  switch (itemType) {
    case 'menu': return <Menu className="h-4 w-4" />;
    case 'logo': return <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center text-xs font-bold">L</div>;
    case 'cart': return <ShoppingCart className="h-4 w-4" />;
    case 'profile': return <User className="h-4 w-4" />;
    case 'wishlist': return <Heart className="h-4 w-4" />;
    case 'search': return <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center"><div className="w-2 h-2 border border-gray-400 rounded-full"></div></div>;
    default: return <Type className="h-4 w-4" />;
  }
};

// Sortable Item Component
function SortableHeaderItem({ 
  itemType, 
  item, 
  onItemClick 
}: {
  itemType: string;
  item: any;
  onItemClick: (itemType: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemType });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg bg-[#1a1a1f] border border-[#2a2a30] hover:border-[#3a3a40] cursor-pointer transition-colors group ${isDragging ? 'shadow-lg z-10' : ''}`}
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing transition-colors mr-2"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div 
        onClick={() => onItemClick(itemType)}
        className="flex items-center justify-between flex-1"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#2a2a30] text-gray-300 group-hover:text-white transition-colors">
            {getItemIcon(itemType)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-200 capitalize font-medium">
              {itemType === 'profile' ? 'Profile' : itemType === 'wishlist' ? 'Wishlist' : itemType}
            </span>
            <span className="text-xs text-gray-400">
              {item.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

// Header Items List Component
function HeaderItemsList({ 
  headerItems, 
  itemOrder,
  updateHeaderItem, 
  openIconLibrary, 
  ControlRow,
  onItemClick,
  onReorder
}: {
  headerItems: any;
  itemOrder: string[];
  updateHeaderItem: (itemType: string, updates: any) => void;
  openIconLibrary: (itemType: string) => void;
  ControlRow: any;
  onItemClick: (itemType: string) => void;
  onReorder: (newOrder: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = itemOrder.indexOf(active.id as string);
      const newIndex = itemOrder.indexOf(over.id as string);
      const newOrder = arrayMove(itemOrder, oldIndex, newIndex);
      onReorder(newOrder);
    }
  }

  return (
    <div className="rounded-lg border border-[#2a2a30] bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
        <span className="text-sm font-medium tracking-wide text-gray-200">APPBAR ITEMS</span>
        <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
      </div>
      <div className="p-4 space-y-2">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={itemOrder}
            strategy={verticalListSortingStrategy}
          >
            {itemOrder.map((itemType) => {
              const item = headerItems[itemType];
              if (!item) return null;
              
              return (
                <SortableHeaderItem
                  key={itemType}
                  itemType={itemType}
                  item={item}
                  onItemClick={onItemClick}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// Individual Item Settings Panel
function ItemSettingsPanel({ 
  itemType, 
  item, 
  updateHeaderItem, 
  openIconLibrary, 
  ControlRow, 
  onBack,
  currentViewport
}: {
  itemType: string;
  item: any;
  updateHeaderItem: (itemType: string, updates: any) => void;
  openIconLibrary: (itemType: string) => void;
  ControlRow: any;
  onBack: () => void;
  currentViewport: 'mobile' | 'tablet' | 'desktop';
}) {
  const [deviceScope, setDeviceScope] = React.useState<'mobile' | 'tablet' | 'desktop'>(currentViewport);
  React.useEffect(() => {
    setDeviceScope(currentViewport);
  }, [currentViewport]);
  return (
    <div className="rounded-lg border border-[#2a2a30] bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-6 h-6 rounded border border-[#2a2a30] text-gray-400 hover:text-white hover:border-[#3a3a40] transition-colors"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
          </button>
          <span className="text-sm font-medium tracking-wide text-gray-200 capitalize">
            {itemType === 'profile' ? 'Profile' : itemType === 'wishlist' ? 'Wishlist' : itemType}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Enable/Disable Toggle - Hide for logo */}
        {itemType !== 'logo' && (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-200">Enabled</span>
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => updateHeaderItem(itemType, { enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
        )}

        {(item.enabled || itemType === 'logo') && (
          <div className="space-y-4">
            {/* Show Opacity and Icon Color controls only for non-logo items */}
            {itemType !== 'logo' && (
              <>
                {/* Opacity Control */}
                <ControlRow
                  label="Opacity"
                  valueText={`${item.transparency}%`}
                  value={item.transparency}
                  min={0}
                  max={100}
                  onChange={(v: number) => updateHeaderItem(itemType, { transparency: v })}
                />

                {/* Icon Color Control */}
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-4 text-sm text-gray-200">Icon Color</span>
                  <div className="col-span-3">
                    <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                      {(item.color || '#ffffff').toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="color"
                      value={item.color || '#ffffff'}
                      onChange={(e) => updateHeaderItem(itemType, { color: e.target.value })}
                      className="h-8 w-full rounded border border-[#2a2a30] bg-transparent cursor-pointer transition-all duration-150 ease-out"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <div className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-300">
                      <Palette className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Item Size Control - Hide for logo */}
            {itemType !== 'logo' && (
              <ControlRow
                label="Item Size"
                valueText={`${item.itemSize || 44.0}`}
                value={item.itemSize || 44.0}
                min={20}
                max={80}
                onChange={(v: number) => updateHeaderItem(itemType, { itemSize: v })}
              />
            )}

            {/* Icon Size Control */}
            <ControlRow
              label="Icon Size"
              valueText={`${item.iconSize || 24.0}`}
              value={item.iconSize || 24.0}
              min={12}
              max={48}
              onChange={(v: number) => updateHeaderItem(itemType, { iconSize: v })}
            />

            {/* Background Color Control */}
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-sm text-gray-200">Background Color</span>
              <div className="col-span-2">
                <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                  {item.backgroundColor === 'transparent' ? '—' : (item.backgroundColor || '#000000').toUpperCase()}
                </span>
              </div>
              <div className="col-span-3">
                <input
                  type="color"
                  value={item.backgroundColor === 'transparent' ? '#000000' : (item.backgroundColor || '#000000')}
                  onChange={(e) => updateHeaderItem(itemType, { backgroundColor: e.target.value })}
                  className="h-8 w-full rounded border border-[#2a2a30] bg-transparent cursor-pointer transition-all duration-150 ease-out"
                />
              </div>
              <div className="col-span-2 flex gap-1">
                <button
                  onClick={() => updateHeaderItem(itemType, { backgroundColor: 'transparent' })}
                  className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-300 hover:bg-[#2a2a30] transition-colors"
                  title="Set transparent background"
                >
                  <div className="w-3 h-3 border border-gray-400 bg-transparent rounded" style={{
                    backgroundImage: 'linear-gradient(45deg, transparent 46%, #ff0000 46%, #ff0000 54%, transparent 54%)',
                    backgroundSize: '6px 6px'
                  }}></div>
                </button>
                <div className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-300">
                  <Palette className="h-3 w-3" />
                </div>
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Border Radius Control */}
            <ControlRow
              label="Border Radius"
              valueText={`${item.borderRadius || 0.0}`}
              value={item.borderRadius || 0.0}
              min={0}
              max={50}
              onChange={(v: number) => updateHeaderItem(itemType, { borderRadius: v })}
            />

            {/* Device Scope Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Device</span>
              <div className="flex items-center gap-1">
                {(['mobile','tablet','desktop'] as const).map((d)=> (
                  <button
                    key={d}
                    onClick={()=>setDeviceScope(d)}
                    className={`px-2 py-1 rounded text-xs border transition-all duration-150 ease-out ${deviceScope===d ? 'bg-[#2563eb] text-white border-[#2563eb] transform scale-105' : 'bg-transparent text-gray-300 border-[#2a2a30] hover:border-[#3a3a40]'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin Controls (Responsive) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-wide text-gray-200">MARGIN ({deviceScope})</span>
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
              </div>
              <div className="space-y-3">
                {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
                  <ControlRow
                    key={side}
                    label={side.charAt(0).toUpperCase() + side.slice(1)}
                    valueText={`${(item.margin?.[deviceScope]?.[side] ?? item.margin?.[side] ?? 0)}`}
                    value={(item.margin?.[deviceScope]?.[side] ?? item.margin?.[side] ?? 0) as number}
                    min={0}
                    max={900}
                    onChange={(v: number) => {
                      const current = item.margin || {};
                      const scope = deviceScope;
                      const scoped = { ...(current as any)[scope], [side]: v };
                      updateHeaderItem(itemType, { 
                        margin: { ...current, [scope]: scoped }
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Padding Controls (Responsive) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-wide text-gray-200">PADDING ({deviceScope})</span>
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
              </div>
              <div className="space-y-3">
                {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
                  <ControlRow
                    key={side}
                    label={side.charAt(0).toUpperCase() + side.slice(1)}
                    valueText={`${(item.padding?.[deviceScope]?.[side] ?? item.padding?.[side] ?? 0)}`}
                    value={(item.padding?.[deviceScope]?.[side] ?? item.padding?.[side] ?? 0) as number}
                    min={0}
                    max={900}
                    onChange={(v: number) => {
                      const current = item.padding || {};
                      const scope = deviceScope;
                      const scoped = { ...(current as any)[scope], [side]: v };
                      updateHeaderItem(itemType, { 
                        padding: { ...current, [scope]: scoped }
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Logo-specific settings */}
            {itemType === 'logo' && (
              <>
                <div>
                  <span className="text-sm text-gray-200 mb-2 block">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const form = new FormData();
                        form.append('file', file);
                        const res = await fetch('/api/upload/image', { method: 'POST', body: form });
                        
                        if (!res.ok) {
                          throw new Error(`Upload failed with status ${res.status}`);
                        }
                        
                        const data = await res.json();
                        if (data?.url) {
                          updateHeaderItem('logo', { imageUrl: data.url });
                        } else {
                          throw new Error('No URL returned from upload');
                        }
                      } catch (err) {
                        console.error('Upload failed', err);
                        alert('Image upload failed. Please check your server configuration.');
                      }
                    }}
                    className="block w-full text-sm text-gray-300 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#2563eb] file:text-white hover:file:bg-[#1d4ed8] cursor-pointer"
                  />
                </div>

                {/* Responsive Heights */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-300 font-medium">RESPONSIVE HEIGHTS</div>
                  {(['mobile', 'tablet', 'desktop'] as const).map((device) => {
                    const height = (item.heights?.[device] || { mobile: 35, tablet: 51, desktop: 55 }[device]) as number;
                    const minHeight = { mobile: 20, tablet: 28, desktop: 36 }[device];
                    const maxHeight = { mobile: 60, tablet: 80, desktop: 100 }[device];
                    
                    return (
                      <div key={device} className="grid grid-cols-12 items-center gap-2">
                        <span className="col-span-3 text-sm text-gray-300 capitalize">{device}</span>
                        <div className="col-span-2">
                          <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                            {height}px
                          </span>
                        </div>
                        <div className="col-span-6">
                          <Slider 
                            value={[height]} 
                            min={minHeight} 
                            max={maxHeight}
                            step={0.5}
                            onValueChange={(vals) => {
                              const newHeight = Number(vals?.[0] ?? height);
                              const currentHeights = item.heights || { mobile: 35, tablet: 51, desktop: 55 };
                              updateHeaderItem(itemType, { 
                                heights: { ...currentHeights, [device]: newHeight } 
                              });
                            }}
                            className="slider-smooth"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            title="Reset"
                            onClick={() => {
                              const currentHeights = item.heights || { mobile: 35, tablet: 51, desktop: 55 };
                              const recommended = { mobile: 35, tablet: 51, desktop: 55 }[device];
                              updateHeaderItem(itemType, { 
                                heights: { ...currentHeights, [device]: recommended } 
                              });
                            }}
                            className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-400 hover:text-white transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Logo Preview */}
                {item.imageUrl && (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">Logo Preview</div>
                    <div className="flex items-center justify-center p-4 border border-[#2a2a30] rounded bg-[#0b0c0f]" style={{ opacity: 1 - (item.transparency / 100), backgroundColor: item.backgroundColor || '#0b0c0f', borderRadius: item.borderRadius ?? 0, padding: `${item.padding?.top ?? 0}px ${item.padding?.right ?? 0}px ${item.padding?.bottom ?? 0}px ${item.padding?.left ?? 0}px`, margin: `${item.margin?.top ?? 0}px ${item.margin?.right ?? 0}px ${item.margin?.bottom ?? 0}px ${item.margin?.left ?? 0}px` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.imageUrl} 
                        alt="Logo" 
                        style={{ 
                          height: `${item.heights?.desktop || 55}px`, 
                          width: 'auto',
                          maxWidth: '100%'
                        }} 
                      />
                    </div>
                    <div className="text-xs text-gray-400 text-center p-2 bg-[#1a1a1f] rounded">
                      M: {item.heights?.mobile || 35}px | T: {item.heights?.tablet || 51}px | D: {item.heights?.desktop || 55}px
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Icon selection for non-logo items */}
            {itemType !== 'logo' && (
              <button
                onClick={() => openIconLibrary(itemType)}
                className="w-full text-sm px-4 py-3 rounded bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
              >
                {item.icon || item.previewIcon ? 'Change Icon' : 'Add Icon'}
              </button>
            )}

            {/* Icon Preview for non-logo items */}
            {itemType !== 'logo' && (
              <div
                className="flex items-center justify-center border border-[#2a2a30] rounded"
                style={{
                  opacity: 1 - (item.transparency / 100),
                  backgroundColor: item.backgroundColor || '#0b0c0f',
                  width: `${item.itemSize || 44}px`,
                  height: `${item.itemSize || 44}px`,
                  borderRadius: item.borderRadius ?? 0,
                  color: item.color || '#ffffff',
                  padding: `${item.padding?.top ?? 0}px ${item.padding?.right ?? 0}px ${item.padding?.bottom ?? 0}px ${item.padding?.left ?? 0}px`,
                  margin: `${item.margin?.top ?? 0}px ${item.margin?.right ?? 0}px ${item.margin?.bottom ?? 0}px ${item.margin?.left ?? 0}px`,
                }}
              >
                {(() => {
                  const desiredSize = item.iconSize || 24;
                  const tryRender = (node: any) => {
                    if (!React.isValidElement(node)) return null;
                    const existingStyle = (node.props as any)?.style || {};
                    return React.cloneElement(node as any, {
                      style: {
                        ...existingStyle,
                        width: desiredSize,
                        height: desiredSize,
                        color: item.color || '#ffffff',
                      },
                    });
                  };
                  return (
                    tryRender(item.previewIcon) ||
                    tryRender(item.icon) ||
                    tryRender(getItemIcon(itemType)) ||
                    null
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeaderOverviewPanel({
  value,
  onChange,
  onAddNew,
  onEditItem,
  viewport,
}: {
  value: {
    enableAppBar?: boolean;
    alwaysShowAppBar?: boolean;
    backgroundColor?: string;
    elevation?: number;
    pinned?: boolean;
    left?: Array<{ id: string; type: string; label?: string }>;
    right?: Array<{ id: string; type: string; label?: string }>;
    center?: Array<{ id: string; type: string; label?: string }>;
    itemOrder?: string[];
    headerStyle?: {
      heights?: { desktop?: number; tablet?: number; mobile?: number };
      backgroundColor?: string;
      gradientEnabled?: boolean;
      gradientFrom?: string;
      gradientTo?: string;
      transparency?: number;
    };
    headerItems?: {
      [key: string]: {
        enabled?: boolean;
        icon?: React.ReactNode;
        previewIcon?: React.ReactNode;
        transparency?: number;
        color?: string;
        imageUrl?: string;
        width?: number;
        alignment?: string;
        iconName?: string;
        heights?: { mobile?: number; tablet?: number; desktop?: number };
        itemSize?: number;
        iconSize?: number;
        backgroundColor?: string;
        borderRadius?: number;
        margin?: { left?: number; right?: number; top?: number; bottom?: number };
        padding?: { left?: number; right?: number; top?: number; bottom?: number };
      };
    };
    brandText?: string;
  } | undefined;
  onChange: (v: any) => void;
  onAddNew: () => void;
  onEditItem: (index: number) => void;
  viewport?: 'mobile' | 'tablet' | 'desktop';
}) {
  const currentViewport: 'mobile' | 'tablet' | 'desktop' =
    viewport === 'mobile' || viewport === 'tablet' || viewport === 'desktop'
      ? viewport
      : 'mobile';
  // Track when changes come from props to avoid overwriting saved settings on first render
  const skipPropagateRef = useRef(false);

  const [headerItems, setHeaderItems] = useState({
    logo: { 
      enabled: true, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff', 
      imageUrl: '', 
      heights: { mobile: 28, tablet: 40, desktop: 50 }, // Responsive heights following best practices
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    },
    menu: { 
      enabled: true, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff',
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    },
    search: { 
      enabled: false, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff',
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    },
    profile: { 
      enabled: true, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff',
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    },
    cart: { 
      enabled: true, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff',
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    },
    wishlist: { 
      enabled: true, 
      icon: null, 
      previewIcon: null,
      transparency: 0, 
      color: '#ffffff',
      itemSize: 44.0,
      iconSize: 24.0,
      backgroundColor: '#000000',
      borderRadius: 0.0,
      margin: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 },
      padding: { left: 0.0, right: 0.0, top: 0.0, bottom: 0.0 }
    }
  });
  
  // State for maintaining item order
  const [itemOrder, setItemOrder] = useState(['logo', 'menu', 'search', 'profile', 'cart', 'wishlist']);
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  const [currentIconTarget, setCurrentIconTarget] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [headerSettings, setHeaderSettings] = useState({
    heights: { desktop: 64, tablet: 56, mobile: 48 },
    backgroundColor: '#ffffff',
    gradientEnabled: false,
    gradientFrom: '#ffffff',
    gradientTo: '#f3f4f6',
    transparency: 0
  });
  const defaultHeights = { desktop: 64, tablet: 56, mobile: 48 } as const;
  const v = {
    enableAppBar: value?.enableAppBar ?? true,
    alwaysShowAppBar: value?.alwaysShowAppBar ?? false,
    backgroundColor: value?.backgroundColor ?? '#111827',
    elevation: value?.elevation ?? 0,
    pinned: value?.pinned ?? false,
  };

  const update = (partial: Partial<typeof v>) => onChange({ ...v, ...partial });

  const updateHeaderItem = (itemType: string, updates: any) => {
    setHeaderItems(prev => ({
      ...prev,
      [itemType]: { ...prev[itemType as keyof typeof prev], ...updates }
    }));
  };

  const handleIconSelect = (iconName: string, iconComponent: React.ReactNode) => {
    if (currentIconTarget) {
      // Store only serializable metadata in state that will be propagated to renderer/layout
      // The visual React node is kept locally for preview purposes via a separate key
      // Only store the icon if it's a valid React element, otherwise fallback to iconName
      const validIcon = React.isValidElement(iconComponent) ? iconComponent : null;
      updateHeaderItem(currentIconTarget, { icon: null, previewIcon: validIcon, iconName });
    }
    setShowIconLibrary(false);
    setCurrentIconTarget('');
  };

  const openIconLibrary = (itemType: string) => {
    setCurrentIconTarget(itemType);
    setShowIconLibrary(true);
  };

  const updateHeaderSettings = (updates: any) => {
    setHeaderSettings(prev => ({ ...prev, ...updates }));
  };

  // Reset all header settings and items to defaults, center logo and apply default padding
  const handleResetAll = () => {
    const defaultHeaderSettings = {
      heights: { desktop: 64, tablet: 56, mobile: 48 },
      backgroundColor: '#ffffff',
      gradientEnabled: false,
      gradientFrom: '#ffffff',
      gradientTo: '#f3f4f6',
      transparency: 0
    };
    const defaultItems = {
      logo: {
        enabled: true,
        icon: null,
        previewIcon: null,
        transparency: 0,
        color: '#111827',
        imageUrl: headerItems.logo.imageUrl || '',
        heights: { mobile: 28, tablet: 40, desktop: 50 },
        itemSize: 44,
        iconSize: 24,
        backgroundColor: 'transparent',
        borderRadius: 0,
        margin: { left: 0, right: 0, top: 0, bottom: 0 },
        padding: { left: 8, right: 8, top: 0, bottom: 0 },
        alignment: 'center'
      },
      menu: { enabled: true, icon: null, previewIcon: null, transparency: 0, color: '#111827', itemSize: 44, iconSize: 24, backgroundColor: 'transparent', borderRadius: 0, margin: { left: 0, right: 0, top: 0, bottom: 0 }, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      search: { enabled: false, icon: null, previewIcon: null, transparency: 0, color: '#111827', itemSize: 44, iconSize: 24, backgroundColor: 'transparent', borderRadius: 0, margin: { left: 0, right: 0, top: 0, bottom: 0 }, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      profile: { enabled: true, icon: null, previewIcon: null, transparency: 0, color: '#111827', itemSize: 44, iconSize: 24, backgroundColor: 'transparent', borderRadius: 0, margin: { left: 0, right: 0, top: 0, bottom: 0 }, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      cart: { enabled: true, icon: null, previewIcon: null, transparency: 0, color: '#111827', itemSize: 44, iconSize: 24, backgroundColor: 'transparent', borderRadius: 0, margin: { left: 0, right: 0, top: 0, bottom: 0 }, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      wishlist: { enabled: true, icon: null, previewIcon: null, transparency: 0, color: '#111827', itemSize: 44, iconSize: 24, backgroundColor: 'transparent', borderRadius: 0, margin: { left: 0, right: 0, top: 0, bottom: 0 }, padding: { left: 0, right: 0, top: 0, bottom: 0 } }
    } as typeof headerItems;

    setHeaderSettings(defaultHeaderSettings);
    setHeaderItems(defaultItems);
    setItemOrder(['logo', 'menu', 'search', 'profile', 'cart', 'wishlist']);

    // Force propagate immediately
    onChange({
      ...(value || {}),
      headerStyle: defaultHeaderSettings,
      headerItems: defaultItems,
      itemOrder: ['logo', 'menu', 'search', 'profile', 'cart', 'wishlist'],
      left: [ { id: 'logo-1', type: 'logo', label: 'Logo', order: 0 } ],
      center: [],
      right: [
        { id: 'cart-1', type: 'cart', label: 'Cart', order: 1 },
        { id: 'profile-1', type: 'profile', label: 'Profile', order: 2 },
        { id: 'wishlist-1', type: 'wishlist', label: 'Wishlist', order: 3 }
      ],
      brandText: value?.brandText || ''
    });
  };

  const handleReorder = (newOrder: string[]) => {
    setItemOrder(newOrder);
  };

  // Load initial state from value prop
  useEffect(() => {
    skipPropagateRef.current = true;
    if (value?.headerStyle) {
      setHeaderSettings(prev => ({
        ...prev,
        ...value.headerStyle,
        heights: {
          desktop: value.headerStyle?.heights?.desktop ?? prev.heights.desktop,
          tablet: value.headerStyle?.heights?.tablet ?? prev.heights.tablet,
          mobile: value.headerStyle?.heights?.mobile ?? prev.heights.mobile,
        }
      }));
    }
    if (value?.headerItems) {
      // Clean up any invalid React elements that might have been serialized
      const cleanedHeaderItems = Object.keys(value.headerItems).reduce((acc, key) => {
        const item = value.headerItems![key];
        if (item) {
          acc[key] = {
            ...item,
            // Remove any invalid React elements
            icon: React.isValidElement(item.icon) ? item.icon : null,
            previewIcon: React.isValidElement(item.previewIcon) ? item.previewIcon : null,
          };
        }
        return acc;
      }, {} as any);
      setHeaderItems(prev => ({ ...prev, ...cleanedHeaderItems }));
    }
    if (value?.itemOrder) {
      setItemOrder(value.itemOrder);
    }
    // brandText handled separately in input
  }, [value]);

  // Propagate settings up so preview can reflect changes, but skip the cycle triggered by prop hydration
  useEffect(() => {
    if (skipPropagateRef.current) {
      skipPropagateRef.current = false;
      return;
    }

    // Build left, center, and right arrays based on enabled items and their drag order
    // Items are distributed to maintain logical groupings
    const leftItems: any[] = [];
    const centerItems: any[] = [];
    const rightItems: any[] = [];

    // Get enabled items in order
    const enabledItems = itemOrder
      .map((itemType) => {
        const item = headerItems[itemType as keyof typeof headerItems];
        if (item && item.enabled) {
          return {
            id: `${itemType}-1`,
            type: itemType,
            label: itemType.charAt(0).toUpperCase() + itemType.slice(1),
            order: itemOrder.indexOf(itemType)
          };
        }
        return null;
      })
      .filter(Boolean);

    // Distribute items more logically - fill left first, then right, center gets minimal items
    const totalItems = enabledItems.length;
    const itemsPerSide = Math.ceil(totalItems / 2);

    enabledItems.forEach((itemConfig, index) => {
      if (itemConfig) {
        if (index < itemsPerSide) {
          leftItems.push(itemConfig);
        } else {
          rightItems.push(itemConfig);
        }
      }
    });

    const newConfig = {
      backgroundColor: headerSettings.gradientEnabled ? undefined : headerSettings.backgroundColor,
      headerStyle: { ...headerSettings },
      headerItems: { ...headerItems },
      left: leftItems,
      right: rightItems,
      center: centerItems,
      itemOrder: [...itemOrder], // Include order in config
      brandText: value?.brandText || ''
    };

    const hasChanged =
      JSON.stringify(newConfig.headerStyle) !== JSON.stringify(value?.headerStyle) ||
      JSON.stringify(newConfig.headerItems) !== JSON.stringify(value?.headerItems) ||
      JSON.stringify(newConfig.left) !== JSON.stringify(value?.left) ||
      JSON.stringify(newConfig.right) !== JSON.stringify(value?.right) ||
      JSON.stringify(newConfig.center) !== JSON.stringify(value?.center) ||
      JSON.stringify(newConfig.itemOrder) !== JSON.stringify(value?.itemOrder) ||
      newConfig.backgroundColor !== value?.backgroundColor;

    if (hasChanged) {
      onChange({
        ...value,
        ...newConfig
      });
    }
  }, [headerSettings, headerItems, itemOrder, onChange, value]);

  // Small pill showing current value like the sample UI
  const ValueChip = ({ children }: { children: React.ReactNode }) => (
    <span className="px-4 py-2 rounded-lg bg-[#0b0c0f] border border-[#2a2a30] text-sm text-gray-100 min-w-[56px] text-center font-mono font-medium">
      {children}
    </span>
  );

  // Reusable row layout: Label | Chip | Slider | IconBtn with optimized performance
  const ControlRow = ({
    label,
    valueText,
    value,
    min = 0,
    max = 100,
    onChange,
    action,
  }: {
    label: string;
    valueText: string | number;
    value: number;
    min?: number;
    max?: number;
    onChange: (v: number) => void;
    action?: { icon: React.ReactNode; onClick: () => void; title?: string };
  }) => {
    // Debounce slider changes to reduce lag
    const [localValue, setLocalValue] = React.useState(value);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleSliderChange = (vals: number[]) => {
      const newValue = Number(vals?.[0] ?? value);
      setLocalValue(newValue);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce the onChange call to reduce updates
      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, 50); // 50ms debounce
    };

    return (
      <div className="grid grid-cols-12 items-center gap-2">
        <span className="col-span-3 text-sm text-gray-200">{label}</span>
        <div className="col-span-2">
          <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
            {typeof valueText === 'string' ? valueText : localValue}
          </span>
        </div>
        <div className="col-span-6">
          <Slider 
            value={[localValue]} 
            min={min} 
            max={max} 
            step={0.1}
            onValueChange={handleSliderChange}
            className="slider-smooth"
          />
        </div>
        <div className="col-span-1 flex justify-end">
          {action ? (
            <button
              title={action.title || 'action'}
              onClick={action.onClick}
              className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-300 hover:text-white hover:border-[#3a3a40] transition-colors"
            >
              {action.icon}
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 scroll-smooth overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
      {/* Header Heights */}
      <div className="rounded-lg border border-[#2a2a30] bg-black transition-all duration-200 ease-out">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
          <span className="text-sm font-medium tracking-wide text-gray-200">HEADER HEIGHT</span>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 text-xs text-gray-300 bg-[#141418] border border-[#2a2a30] px-3 py-1.5 rounded hover:bg-[#1a1a1f] transition-all duration-150 ease-out"
            title="Reset all to defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset All
          </button>
        </div>
        <div className="p-4 space-y-3">
          {(['desktop','tablet','mobile'] as const).map((device) => {
            const height = (headerSettings.heights as any)[device] as number;
            return (
              <ControlRow
                key={device}
                label={device}
                valueText={`${height}px`}
                value={height}
                min={40}
                max={100}
                onChange={(v)=>updateHeaderSettings({ heights: { ...headerSettings.heights, [device]: v } })}
                action={{
                  icon: <RotateCcw className="h-3.5 w-3.5" />,
                  title: 'Reset',
                  onClick: ()=>updateHeaderSettings({ heights: { ...headerSettings.heights, [device]: (defaultHeights as any)[device] } })
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Header Colors & Gradient */}
      <div className="rounded-lg border border-[#2a2a30] bg-black transition-all duration-200 ease-out">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
          <span className="text-sm font-medium tracking-wide text-gray-200">HEADER COLORS</span>
          <span className="text-xs text-gray-400">Auto-synced</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-200">Enable Gradient</span>
            <input
              type="checkbox"
              checked={headerSettings.gradientEnabled}
              onChange={(e) => updateHeaderSettings({ gradientEnabled: e.target.checked })}
              className="w-4 h-4 transition-all duration-150 ease-out"
            />
          </div>
          
          {!headerSettings.gradientEnabled ? (
            <div className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-4 text-sm text-gray-200">Background</span>
              <div className="col-span-3">
                <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                  {headerSettings.backgroundColor.toUpperCase()}
                </span>
              </div>
              <div className="col-span-4">
                <input
                  type="color"
                  value={headerSettings.backgroundColor}
                  onChange={(e) => updateHeaderSettings({ backgroundColor: e.target.value })}
                  className="h-8 w-full rounded border border-[#2a2a30] bg-transparent cursor-pointer transition-all duration-150 ease-out"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <div className="h-6 w-6 grid place-items-center rounded border border-[#2a2a30] text-gray-300 transition-colors duration-150">
                  <Palette className="h-3 w-3" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-3 text-sm text-gray-200">From</span>
                <div className="col-span-3">
                  <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                    {headerSettings.gradientFrom.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-6">
                  <input
                    type="color"
                    value={headerSettings.gradientFrom}
                    onChange={(e) => updateHeaderSettings({ gradientFrom: e.target.value })}
                    className="h-8 w-full rounded border border-[#2a2a30] bg-transparent cursor-pointer transition-all duration-150 ease-out"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-3 text-sm text-gray-200">To</span>
                <div className="col-span-3">
                  <span className="px-2 py-1 rounded bg-[#0b0c0f] border border-[#2a2a30] text-xs text-gray-100 font-mono">
                    {headerSettings.gradientTo.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-6">
                  <input
                    type="color"
                    value={headerSettings.gradientTo}
                    onChange={(e) => updateHeaderSettings({ gradientTo: e.target.value })}
                    className="h-8 w-full rounded border border-[#2a2a30] bg-transparent cursor-pointer transition-all duration-150 ease-out"
                  />
                </div>
              </div>
            </>
          )}
          
          <ControlRow
            label="Transparency"
            valueText={`${headerSettings.transparency}%`}
            value={headerSettings.transparency}
            min={0}
            max={100}
            onChange={(v)=>updateHeaderSettings({ transparency: v })}
          />
        </div>
      </div>

      {/* Brand Text */}
      <div className="rounded-lg border border-[#2a2a30] bg-black transition-all duration-200 ease-out">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a30]">
          <span className="text-sm font-medium tracking-wide text-gray-200">BRAND TEXT</span>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter brand name..."
            value={value?.brandText || ''}
            onChange={(e) => {
              const newConfig = { ...value, brandText: e.target.value };
              onChange(newConfig);
            }}
            className="w-full px-3 py-2 rounded bg-[#0f0f12] border border-[#2a2a30] text-white text-sm focus:border-[#2563eb] focus:outline-none transition-all duration-200 ease-out"
          />
        </div>
      </div>

{/* Header Items - New UI */}
      {selectedItem ? (
        <ItemSettingsPanel
          itemType={selectedItem}
          item={headerItems[selectedItem as keyof typeof headerItems]}
          updateHeaderItem={updateHeaderItem}
          openIconLibrary={openIconLibrary}
          ControlRow={ControlRow}
          onBack={() => setSelectedItem(null)}
          currentViewport={currentViewport}
        />
      ) : (
        <HeaderItemsList 
          headerItems={headerItems}
          itemOrder={itemOrder}
          updateHeaderItem={updateHeaderItem}
          openIconLibrary={openIconLibrary}
          ControlRow={ControlRow}
          onItemClick={(itemType) => setSelectedItem(itemType)}
          onReorder={handleReorder}
        />
      )}

      {/* Icon Library Modal */}
      <IconLibraryModal
        open={showIconLibrary}
        onOpenChange={setShowIconLibrary}
        onSelectIcon={handleIconSelect}
      />
    </div>
  );
}


