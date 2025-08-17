"use client";

import React from "react";
import { CmsBlock, CmsLayoutData } from "@/lib/cms/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon, ShoppingCartIcon, MenuIcon, UserIcon, Heart as HeartIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Hero({ title, subtitle, cta, backgroundImage, ctaLink }: { 
  title?: string; 
  subtitle?: string; 
  cta?: string;
  backgroundImage?: string;
  ctaLink?: string;
}) {
  return (
    <section 
      className="relative rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 md:p-12 overflow-hidden"
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {backgroundImage && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{title || "Welcome to Our Store"}</h1>
        {subtitle && <p className="text-lg md:text-xl text-gray-200 mb-6">{subtitle}</p>}
        {cta && (
          <Link href={ctaLink || "#"}>
            <Button size="lg" className="text-lg px-8 py-3">
              {cta}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}

function HeaderSearch({ placeholder, showLogo, forceLight }: { placeholder?: string; showLogo?: boolean; forceLight?: boolean }) {
  return (
    <header className={`${forceLight ? 'bg-white border-gray-200' : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {showLogo && (
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store</h1>
            </div>
          )}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder={placeholder || "Search products..."} 
                className="pl-10 pr-4"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <UserIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingCartIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function getElevationShadow(level: number): string {
  const l = Math.max(0, Math.min(10, Math.floor(level)));
  if (l === 0) return "none";
  // Simple Material-like elevation approximation
  const y = Math.round(l * 0.5 + 1);
  const blur = l * 2 + 2;
  const spread = Math.max(0, Math.floor(l / 3));
  return `0 ${y}px ${blur}px ${spread}px rgba(0,0,0,0.15)`;
}

function AppHeader({
  variant = 'desktop',
  viewport = 'desktop',
  left = [],
  center = [],
  right = [],
  menuItems = [],
  mobileCollapsed = true,
  brandText = '',
  enableAppBar = false,
  alwaysShowAppBar = false,
  backgroundColor,
  elevation = 0,
  pinned = false,
  forceLight = false,
  headerStyle,
  showAlignmentGuides = false,
}: {
  variant?: 'mobile' | 'desktop';
  viewport?: 'mobile' | 'tablet' | 'desktop';
  left?: any[];
  center?: any[];
  right?: any[];
  menuItems?: Array<{ label: string; href: string }>;
  mobileCollapsed?: boolean;
  brandText?: string;
  enableAppBar?: boolean;
  alwaysShowAppBar?: boolean;
  backgroundColor?: string;
  elevation?: number;
  pinned?: boolean;
  forceLight?: boolean;
  headerStyle?: { gradientEnabled?: boolean; gradientFrom?: string; gradientTo?: string; transparency?: number; heights?: { desktop?: number; tablet?: number; mobile?: number } };
  showAlignmentGuides?: boolean;
}) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  
  const stickyClass = enableAppBar && pinned ? 'sticky top-0 z-50' : '';
  const iconStyleFromMeta = (it:any): React.CSSProperties => ({
    color: it.iconColor || '#ffffff',
    opacity: it.iconTransparency !== undefined ? (1 - (it.iconTransparency/100)) : 1,
    width: typeof it.iconSize === 'number' ? it.iconSize : undefined,
    height: typeof it.iconSize === 'number' ? it.iconSize : undefined,
  });
  const renderItemElement = (it:any, viewport?: 'mobile' | 'tablet' | 'desktop') => {
    const iconStyle = iconStyleFromMeta(it);
    
    // For logos, use responsive heights instead of fixed width
    const getLogoHeight = () => {
      if (it.type === 'logo' && it.heights) {
        const currentViewport = viewport || variant;
        if (currentViewport === 'mobile') return it.heights.mobile || 28;
        if (currentViewport === 'tablet') return it.heights.tablet || 40;
        return it.heights.desktop || 50;
      }
      return it.width || 24; // Fallback for old width-based logos
    };
    
    // First check if there's a custom icon selected via iconName
    if (it.iconName && (LucideIcons as any)[it.iconName]) {
      const Comp = (LucideIcons as any)[it.iconName];
      return <Comp className="h-5 w-5" style={iconStyle} />;
    }
    
    // Logo special cases handled in callers where logoUrl may be injected
    if (it.type === 'logo') {
      // If no custom icon is set, use a default store icon
      const StoreIcon = (LucideIcons as any)['Store'] || (LucideIcons as any)['Building2'] || (LucideIcons as any)['Home'];
      // Just use iconStyle which already contains width and height from iconSize
      return StoreIcon ? <StoreIcon style={iconStyle} /> : <span className="font-bold text-lg" style={iconStyle}>{it.title || it.label || 'LOGO'}</span>;
    }
    if (it.type === 'menu') {
      const MenuIcon = (LucideIcons as any)['Menu'];
      const MenuIconElement = MenuIcon ? <MenuIcon className="h-5 w-5" style={iconStyle} /> : <span style={iconStyle}>☰</span>;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity">
              {MenuIconElement}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>
              <LucideIcons.Home className="mr-2 h-4 w-4" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Tag className="mr-2 h-4 w-4" />
              Categories
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Percent className="mr-2 h-4 w-4" />
              Sale
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LucideIcons.Phone className="mr-2 h-4 w-4" />
              Contact
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Info className="mr-2 h-4 w-4" />
              About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (it.type === 'search') {
      const SearchIconComp = (LucideIcons as any)['Search'];
      const SearchIconElement = SearchIconComp ? <SearchIconComp className="h-5 w-5" style={iconStyle} /> : <SearchIcon className="h-5 w-5" style={iconStyle} />;
      
      return (
        <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity">
              {SearchIconElement}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  autoFocus
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <div>Popular searches:</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">T-shirts</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">Jeans</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">Shoes</span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (it.type === 'profile') {
      const UserIconComp = (LucideIcons as any)['User'];
      const ProfileIcon = UserIconComp ? <UserIconComp className="h-5 w-5" style={iconStyle} /> : <UserIcon className="h-5 w-5" style={iconStyle} />;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity">
              {ProfileIcon}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Package className="mr-2 h-4 w-4" />
              My Orders
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Heart className="mr-2 h-4 w-4" />
              Wishlist
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LucideIcons.LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (it.type === 'wishlist') {
      const HeartIcon = (LucideIcons as any)['Heart'];
      const HeartIconElement = HeartIcon ? <HeartIcon className="h-5 w-5" style={iconStyle} /> : <span style={iconStyle}>♡</span>;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity relative">
              {HeartIconElement}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-4">
              <div className="text-sm font-medium mb-2">Your Wishlist</div>
              <div className="text-sm text-gray-500 text-center">No items in your wishlist</div>
              <div className="mt-4">
                <Button className="w-full" size="sm">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (it.type === 'cart') {
      const CartIcon = (LucideIcons as any)['ShoppingCart'];
      const CartIconElement = CartIcon ? <CartIcon className="h-5 w-5" style={iconStyle} /> : <ShoppingCartIcon className="h-5 w-5" style={iconStyle} />;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity relative">
              {CartIconElement}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-4">
              <div className="text-sm text-gray-500 text-center">Your cart is empty</div>
              <div className="mt-4 space-y-2">
                <Button className="w-full" size="sm">
                  View Cart
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    if (it.type === 'text') return <span className="text-xs uppercase tracking-wide">{it.title || 'Text'}</span>;
    return it.title || it.label || it.type;
  };
  const baseStyle: React.CSSProperties = {
    ...(elevation && elevation > 0 ? { boxShadow: getElevationShadow(elevation) } : {}),
  };
  const bgStyle: React.CSSProperties = headerStyle?.gradientEnabled
    ? { backgroundImage: `linear-gradient(90deg, ${headerStyle?.gradientFrom || '#ffffff'}, ${headerStyle?.gradientTo || '#f3f4f6'})` }
    : (backgroundColor ? { backgroundColor } : {});
  const opacityStyle: React.CSSProperties = typeof headerStyle?.transparency === 'number'
    ? { opacity: Math.max(0, Math.min(1, 1 - (headerStyle!.transparency! / 100))) }
    : {};
  const heightPx = variant === 'mobile'
    ? (headerStyle?.heights?.mobile)
    : (viewport === 'tablet' ? (headerStyle?.heights?.tablet) : (headerStyle?.heights?.desktop));
  const heightStyle: React.CSSProperties = heightPx ? { minHeight: `${heightPx}px` } : {};
  const style: React.CSSProperties = { ...baseStyle, ...bgStyle, ...opacityStyle, ...heightStyle };
  if (variant === 'mobile') {
    return (
      <div className={`relative w-full px-4 py-3 ${forceLight ? 'bg-white border-b border-gray-200' : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'} ${stickyClass}`} style={style}>
        {/* Alignment Guidelines */}
        {showAlignmentGuides && (
          <>
            {/* Left Guide */}
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-blue-400/50 pointer-events-none z-10">
              <div className="absolute -top-1 -left-2 text-xs bg-blue-400 text-white px-1 rounded">L</div>
            </div>
            {/* Center Guide */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-400/50 pointer-events-none z-10 transform -translate-x-0.5">
              <div className="absolute -top-1 -left-2 text-xs bg-green-400 text-white px-1 rounded">C</div>
            </div>
            {/* Right Guide */}
            <div className="absolute right-16 top-0 bottom-0 w-0.5 bg-red-400/50 pointer-events-none z-10">
              <div className="absolute -top-1 -left-2 text-xs bg-red-400 text-white px-1 rounded">R</div>
            </div>
            {/* Section Boundaries */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300/30 pointer-events-none z-10"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-gray-300/30 pointer-events-none z-10"></div>
          </>
        )}
        <div className="w-full flex items-center justify-between gap-3">
          {/* Left side items */}
          <div className="flex items-center gap-3 min-w-[48px]">
            {left
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((it:any, i:number) => {
              const scope = variant === 'mobile' ? 'mobile' : (viewport || 'desktop');
              const pad = (it.padding?.[scope]) || it.padding || {};
              const mar = (it.margin?.[scope]) || it.margin || {};
              
              // Apply custom spacing to all icons, not just logos
              const hasCustomSpacing = true;
              
              // For centering: if both left and right margins are equal, use margin auto
              const leftMarginValue = mar.left || 0;
              const rightMarginValue = mar.right || 0;
              const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
              
              // More flexible margin limits for better positioning
              const maxMarginLimit = variant === 'mobile' ? 300 : 500;
              
              const leftMargin = hasCustomSpacing && !shouldCenter ? Math.min(leftMarginValue, maxMarginLimit) : 0;
              const rightMargin = hasCustomSpacing && !shouldCenter ? Math.min(rightMarginValue, maxMarginLimit) : 0;
              const topMargin = hasCustomSpacing ? Math.max(-100, Math.min(mar.top || 0, 100)) : 0;
              const bottomMargin = hasCustomSpacing ? Math.max(-100, Math.min(mar.bottom || 0, 100)) : 0;
              
              const itemStyle: React.CSSProperties = {
                fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
                fontWeight: it.fontWeight || undefined,
                color: it.textColor || undefined,
                opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
                backgroundColor: it.backgroundColor || undefined,
                borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                paddingLeft: (hasCustomSpacing && pad.left) ? `${pad.left}px` : undefined,
                paddingRight: (hasCustomSpacing && pad.right) ? `${pad.right}px` : undefined,
                paddingTop: (hasCustomSpacing && pad.top) ? `${pad.top}px` : undefined,
                paddingBottom: (hasCustomSpacing && pad.bottom) ? `${pad.bottom}px` : undefined,
                width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
                alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
                justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
                boxSizing: 'border-box',
                // Icon margin logic: use margin auto for centering or custom margins
                marginLeft: hasCustomSpacing ? (shouldCenter ? 'auto' : (leftMargin > 0 ? `${leftMargin}px` : undefined)) : undefined,
                marginRight: hasCustomSpacing ? (shouldCenter ? 'auto' : (rightMargin > 0 ? `${rightMargin}px` : undefined)) : undefined,
                marginTop: (hasCustomSpacing && topMargin !== 0) ? `${topMargin}px` : undefined,
                marginBottom: (hasCustomSpacing && bottomMargin !== 0) ? `${bottomMargin}px` : undefined,
              };
              
              return (
                <div key={`ml-${i}`} style={itemStyle}>
                  {it.type === 'logo' && it.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={it.logoUrl} 
                      alt={it.title || 'Logo'} 
                      style={{ 
                        height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.mobile || it.width || 28)}px`, 
                        width: 'auto',
                        maxWidth: '120px', // Prevent logos from getting too wide on mobile
                      }} 
                    />
                  ) : it.type === 'logo' ? (
                    <span className="font-bold">{it.title || 'LOGO'}</span>
                  ) : (
                    renderItemElement(it, 'mobile')
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Center items */}
          <div className="flex-1 flex justify-center">
            {center.length > 0 ? (
              <div className="flex items-center gap-2">
                {center
                  .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                  .map((it:any, i:number) => {
                  const scope = variant === 'mobile' ? 'mobile' : (viewport || 'desktop');
                  const pad = (it.padding?.[scope]) || it.padding || {};
                  const mar = (it.margin?.[scope]) || it.margin || {};
                  
                  // Better margin handling for center section
                  const hasCustomSpacing = true;
                  const leftMarginValue = mar.left || 0;
                  const rightMarginValue = mar.right || 0;
                  const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
                  
                  const offsetX = shouldCenter ? 0 : (leftMarginValue - rightMarginValue);
                  const offsetY = (mar.top ?? 0) - (mar.bottom ?? 0);
                  const itemStyle: React.CSSProperties = {
                    fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
                    fontWeight: it.fontWeight || undefined,
                    color: it.textColor || undefined,
                    opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
                    backgroundColor: it.backgroundColor || undefined,
                    borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                    paddingLeft: pad.left ? `${pad.left}px` : undefined,
                    paddingRight: pad.right ? `${pad.right}px` : undefined,
                    paddingTop: pad.top ? `${pad.top}px` : undefined,
                    paddingBottom: pad.bottom ? `${pad.bottom}px` : undefined,
                    width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                    height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                    display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
                    alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
                    justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
                    boxSizing: 'border-box',
                    transform: (offsetX || offsetY) ? `translate(${offsetX}px, ${offsetY}px)` : undefined,
                  };
                  
                  return (
                    <div key={`mc-${i}`} style={itemStyle}>
                      {it.type === 'logo' && it.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={it.logoUrl} 
                          alt={it.title || 'Logo'} 
                          style={{ 
                            height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.mobile || it.width || 28)}px`, 
                            width: 'auto',
                            maxWidth: '120px',
                          }} 
                        />
                      ) : it.type === 'logo' ? (
                        <span className="font-bold text-[18px] tracking-[0.25em]">{it.title || 'LOGO'}</span>
                      ) : (
                        renderItemElement(it, 'mobile')
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[18px] font-extrabold tracking-[0.25em] text-gray-900 dark:text-white">{brandText}</div>
            )}
          </div>
          
          {/* Right side items */}
          <div className="flex items-center gap-3 min-w-[72px] justify-end">
            {right
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((it:any, i:number) => {
              const scope = variant === 'mobile' ? 'mobile' : (viewport || 'desktop');
              const pad = (it.padding?.[scope]) || it.padding || {};
              const mar = (it.margin?.[scope]) || it.margin || {};
              
              // Apply custom spacing to all icons, not just logos
              const hasCustomSpacing = true;
              
              // For centering: if both left and right margins are equal, use margin auto
              const leftMarginValue = mar.left || 0;
              const rightMarginValue = mar.right || 0;
              const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
              
              // More flexible margin limits for better positioning
              const maxMarginLimit = variant === 'mobile' ? 300 : 500;
              
              const leftMargin = hasCustomSpacing && !shouldCenter ? Math.min(leftMarginValue, maxMarginLimit) : 0;
              const rightMargin = hasCustomSpacing && !shouldCenter ? Math.min(rightMarginValue, maxMarginLimit) : 0;
              const topMargin = hasCustomSpacing ? Math.max(-100, Math.min(mar.top || 0, 100)) : 0;
              const bottomMargin = hasCustomSpacing ? Math.max(-100, Math.min(mar.bottom || 0, 100)) : 0;
              
              const itemStyle: React.CSSProperties = {
                fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
                fontWeight: it.fontWeight || undefined,
                color: it.textColor || undefined,
                opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
                backgroundColor: it.backgroundColor || undefined,
                borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                paddingLeft: (hasCustomSpacing && pad.left) ? `${pad.left}px` : undefined,
                paddingRight: (hasCustomSpacing && pad.right) ? `${pad.right}px` : undefined,
                paddingTop: (hasCustomSpacing && pad.top) ? `${pad.top}px` : undefined,
                paddingBottom: (hasCustomSpacing && pad.bottom) ? `${pad.bottom}px` : undefined,
                width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
                alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
                justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
                boxSizing: 'border-box',
                // Icon margin logic: use margin auto for centering or custom margins
                marginLeft: hasCustomSpacing ? (shouldCenter ? 'auto' : (leftMargin > 0 ? `${leftMargin}px` : undefined)) : undefined,
                marginRight: hasCustomSpacing ? (shouldCenter ? 'auto' : (rightMargin > 0 ? `${rightMargin}px` : undefined)) : undefined,
                marginTop: (hasCustomSpacing && topMargin !== 0) ? `${topMargin}px` : undefined,
                marginBottom: (hasCustomSpacing && bottomMargin !== 0) ? `${bottomMargin}px` : undefined,
              };
              
              return (
                <div key={`mr-${i}`} style={itemStyle}>
                  {it.type === 'logo' && it.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={it.logoUrl} 
                      alt={it.title || 'Logo'} 
                      style={{ 
                        height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.mobile || it.width || 28)}px`, 
                        width: 'auto',
                        maxWidth: '120px',
                      }} 
                    />
                  ) : it.type === 'logo' ? (
                    <span className="font-bold">{it.title || 'LOGO'}</span>
                  ) : (
                    renderItemElement(it, 'mobile')
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {!mobileCollapsed && menuItems.length > 0 && (
          <div className="mt-2 flex items-center gap-4 overflow-x-auto text-sm">
            {menuItems.map((m, i) => (
              <a key={i} href={m.href} className="text-gray-600 dark:text-gray-300 whitespace-nowrap">{m.label}</a>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`relative px-6 py-3 ${forceLight ? 'bg-white border-b border-gray-200' : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'} ${stickyClass}`} style={style}>
      {/* Alignment Guidelines for Desktop */}
      {showAlignmentGuides && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="mx-auto max-w-6xl h-full relative">
            {/* Left Guide */}
            <div className="absolute left-24 top-0 bottom-0 w-0.5 bg-blue-400/50">
              <div className="absolute -top-1 -left-2 text-xs bg-blue-400 text-white px-1 rounded">L</div>
            </div>
            {/* Center Guide */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-400/50 transform -translate-x-0.5">
              <div className="absolute -top-1 -left-2 text-xs bg-green-400 text-white px-1 rounded">C</div>
            </div>
            {/* Right Guide */}
            <div className="absolute right-24 top-0 bottom-0 w-0.5 bg-red-400/50">
              <div className="absolute -top-1 -left-2 text-xs bg-red-400 text-white px-1 rounded">R</div>
            </div>
            {/* Grid Section Boundaries */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-300/30"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-gray-300/30"></div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl grid grid-cols-3 items-center gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-3 justify-start">
          {menuItems.length > 0 && menuItems.map((m, i) => (
            <a key={i} href={m.href} className="text-[12px] tracking-wide uppercase text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">{m.label}</a>
          ))}
          {left
            .filter((l:any)=>l.type!=='menu')
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((it:any, i:number) => {
            const scope = (viewport || 'desktop');
            const pad = (it.padding?.[scope]) || it.padding || {};
            const mar = (it.margin?.[scope]) || it.margin || {};
            
            // Apply custom spacing to all icons, not just logos
            const hasCustomSpacing = true;
            
            // For centering: if both left and right margins are equal, use margin auto
            const leftMarginValue = mar.left || 0;
            const rightMarginValue = mar.right || 0;
            const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
            
            // More flexible margin limits for desktop
            const maxMarginLimit = 800;
            
            const leftMargin = hasCustomSpacing && !shouldCenter ? Math.min(leftMarginValue, maxMarginLimit) : 0;
            const rightMargin = hasCustomSpacing && !shouldCenter ? Math.min(rightMarginValue, maxMarginLimit) : 0;
            const topMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.top || 0, 150)) : 0;
            const bottomMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.bottom || 0, 150)) : 0;
            
            const itemStyle: React.CSSProperties = {
              fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
              fontWeight: it.fontWeight || undefined,
              color: it.textColor || undefined,
              opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
              backgroundColor: it.backgroundColor || undefined,
              borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
              paddingLeft: (hasCustomSpacing && pad.left) ? `${pad.left}px` : undefined,
              paddingRight: (hasCustomSpacing && pad.right) ? `${pad.right}px` : undefined,
              paddingTop: (hasCustomSpacing && pad.top) ? `${pad.top}px` : undefined,
              paddingBottom: (hasCustomSpacing && pad.bottom) ? `${pad.bottom}px` : undefined,
              width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
              height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
              display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
              alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
              justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
              boxSizing: 'border-box',
              // Logo margin logic: use margin auto for centering or custom margins
              marginLeft: hasCustomSpacing ? (shouldCenter ? 'auto' : (leftMargin > 0 ? `${leftMargin}px` : undefined)) : undefined,
              marginRight: hasCustomSpacing ? (shouldCenter ? 'auto' : (rightMargin > 0 ? `${rightMargin}px` : undefined)) : undefined,
              marginTop: (hasCustomSpacing && topMargin !== 0) ? `${topMargin}px` : undefined,
              marginBottom: (hasCustomSpacing && bottomMargin !== 0) ? `${bottomMargin}px` : undefined,
            };
            
            return (
              <div key={`l-${i}`} className="text-[12px] tracking-wide uppercase text-gray-800 dark:text-gray-200" style={itemStyle}>
                {it.type === 'logo' && it.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={it.logoUrl} 
                    alt={it.title || 'Logo'} 
                    style={{ 
                      height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.desktop || it.width || 50)}px`, 
                      width: 'auto',
                      maxWidth: '200px', // Prevent logos from getting too wide on desktop
                    }} 
                  />
                ) : it.type === 'logo' ? (
                  <span className="font-bold">{it.title || 'LOGO'}</span>
                ) : (
                  renderItemElement(it, 'desktop')
                )}
              </div>
            );
          })}
        </div>
        
        {/* Center Section */}
        {(() => {
          const logoItem = center.find((it:any) => it.type === 'logo');
          const sectionAlignment = logoItem?.alignment || 'center';
          const alignmentClass = sectionAlignment === 'left' ? 'justify-start' : sectionAlignment === 'right' ? 'justify-end' : 'justify-center';
          
          return (
            <div className={`flex items-center ${alignmentClass}`} style={{ gap: 8 }}>
              <div className="text-[22px] font-extrabold tracking-[0.35em] text-gray-900 dark:text-white">{brandText}</div>
              {center
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                                  .map((it:any, i:number) => {
                  const scope = (viewport || 'desktop');
                  const pad = (it.padding?.[scope]) || it.padding || {};
                  const mar = (it.margin?.[scope]) || it.margin || {};
                  
                  // Only apply custom spacing to logos, other icons use default spacing
                  const hasCustomSpacing = true;
                  
                  // For centering: if both left and right margins are equal, use margin auto
                  const leftMarginValue = mar.left || 0;
                  const rightMarginValue = mar.right || 0;
                  const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
                  
                  // More flexible margin limits for desktop center
                  const maxMarginLimit = 600;
                  
                  const leftMargin = hasCustomSpacing && !shouldCenter ? Math.min(leftMarginValue, maxMarginLimit) : 0;
                  const rightMargin = hasCustomSpacing && !shouldCenter ? Math.min(rightMarginValue, maxMarginLimit) : 0;
                  const topMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.top || 0, 150)) : 0;
                  const bottomMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.bottom || 0, 150)) : 0;
                  
                  const itemStyle: React.CSSProperties = {
                    fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
                    fontWeight: it.fontWeight || undefined,
                    color: it.textColor || undefined,
                    opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
                    backgroundColor: it.backgroundColor || undefined,
                    borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                    paddingLeft: (hasCustomSpacing && pad.left) ? `${pad.left}px` : undefined,
                    paddingRight: (hasCustomSpacing && pad.right) ? `${pad.right}px` : undefined,
                    paddingTop: (hasCustomSpacing && pad.top) ? `${pad.top}px` : undefined,
                    paddingBottom: (hasCustomSpacing && pad.bottom) ? `${pad.bottom}px` : undefined,
                    width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                    height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                    display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
                    alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
                    justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
                    boxSizing: 'border-box',
                    // Logo margin logic: use margin auto for centering or custom margins
                    marginLeft: hasCustomSpacing ? (shouldCenter ? 'auto' : (leftMargin > 0 ? `${leftMargin}px` : undefined)) : undefined,
                    marginRight: hasCustomSpacing ? (shouldCenter ? 'auto' : (rightMargin > 0 ? `${rightMargin}px` : undefined)) : undefined,
                    marginTop: (hasCustomSpacing && topMargin !== 0) ? `${topMargin}px` : undefined,
                    marginBottom: (hasCustomSpacing && bottomMargin !== 0) ? `${bottomMargin}px` : undefined,
                  };
                
                return (
                  <div key={`c-${i}`} className="text-[12px] tracking-wide uppercase text-gray-800 dark:text-gray-200" style={itemStyle}>
                    {it.type === 'logo' && it.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={it.logoUrl} 
                        alt={it.title || 'Logo'} 
                        style={{ 
                          height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.desktop || it.width || 50)}px`, 
                          width: 'auto',
                          maxWidth: '200px',
                        }} 
                      />
                    ) : it.type === 'logo' ? (
                      <span className="font-bold">{it.title || 'LOGO'}</span>
                    ) : (
                      renderItemElement(it, 'desktop')
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
        
        {/* Right Section */}
        {(() => {
          const logoItem = right.find((it:any) => it.type === 'logo');
          const sectionAlignment = logoItem?.alignment || 'right';
          const alignmentClass = sectionAlignment === 'left' ? 'justify-start' : sectionAlignment === 'right' ? 'justify-end' : 'justify-center';
          
          return (
            <div className={`flex items-center gap-3 ${alignmentClass}`}>
              {right.length ? right
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((it:any, i:number) => {
                const scope = (viewport || 'desktop');
                const pad = (it.padding?.[scope]) || it.padding || {};
                const mar = (it.margin?.[scope]) || it.margin || {};
                
                // Only apply custom spacing to logos, other icons use default spacing
                const hasCustomSpacing = true;
                
                // For centering: if both left and right margins are equal, use margin auto
                const leftMarginValue = mar.left || 0;
                const rightMarginValue = mar.right || 0;
                const shouldCenter = hasCustomSpacing && leftMarginValue > 0 && rightMarginValue > 0 && Math.abs(leftMarginValue - rightMarginValue) <= 5;
                
                // More flexible margin limits for desktop right
                const maxMarginLimit = 800;
                
                const leftMargin = hasCustomSpacing && !shouldCenter ? Math.min(leftMarginValue, maxMarginLimit) : 0;
                const rightMargin = hasCustomSpacing && !shouldCenter ? Math.min(rightMarginValue, maxMarginLimit) : 0;
                const topMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.top || 0, 150)) : 0;
                const bottomMargin = hasCustomSpacing ? Math.max(-150, Math.min(mar.bottom || 0, 150)) : 0;
                
                const itemStyle: React.CSSProperties = {
                  fontSize: it.fontSize ? `${it.fontSize}px` : undefined,
                  fontWeight: it.fontWeight || undefined,
                  color: it.textColor || undefined,
                  opacity: it.textOpacity !== undefined ? it.textOpacity : undefined,
                  backgroundColor: it.backgroundColor || undefined,
                  borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                  paddingLeft: (hasCustomSpacing && pad.left) ? `${pad.left}px` : undefined,
                  paddingRight: (hasCustomSpacing && pad.right) ? `${pad.right}px` : undefined,
                  paddingTop: (hasCustomSpacing && pad.top) ? `${pad.top}px` : undefined,
                  paddingBottom: (hasCustomSpacing && pad.bottom) ? `${pad.bottom}px` : undefined,
                  width: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                  height: typeof it.itemSize === 'number' ? `${it.itemSize}px` : undefined,
                  display: typeof it.itemSize === 'number' ? 'inline-flex' : undefined,
                  alignItems: typeof it.itemSize === 'number' ? 'center' : undefined,
                  justifyContent: typeof it.itemSize === 'number' ? 'center' : undefined,
                  boxSizing: 'border-box',
                  // Logo margin logic: use margin auto for centering or custom margins
                  marginLeft: hasCustomSpacing ? (shouldCenter ? 'auto' : (leftMargin > 0 ? `${leftMargin}px` : undefined)) : undefined,
                  marginRight: hasCustomSpacing ? (shouldCenter ? 'auto' : (rightMargin > 0 ? `${rightMargin}px` : undefined)) : undefined,
                  marginTop: (hasCustomSpacing && topMargin !== 0) ? `${topMargin}px` : undefined,
                  marginBottom: (hasCustomSpacing && bottomMargin !== 0) ? `${bottomMargin}px` : undefined,
                };
                
                return (
                  <div key={`r-${i}`} className="text-[12px] tracking-wide uppercase text-gray-800 dark:text-gray-200" style={itemStyle}>
                    {it.type === 'logo' && it.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={it.logoUrl} 
                        alt={it.title || 'Logo'} 
                        style={{ 
                          height: `${typeof it.iconSize === 'number' ? it.iconSize : (it.heights?.desktop || it.width || 50)}px`, 
                          width: 'auto',
                          maxWidth: '200px',
                        }} 
                      />
                    ) : it.type === 'logo' ? (
                      <span className="font-bold">{it.title || 'LOGO'}</span>
                    ) : (
                      renderItemElement(it, 'desktop')
                    )}
                  </div>
                );
              }) : null}
            </div>
          );
        })()}
      </div>
      </div>
  );
}

function AppFooter({ variant }: { variant?: 'mobile' | 'desktop' }) {
  if (variant === 'mobile') {
    return (
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-14 flex items-center justify-around">
        <button className="text-sm">Home</button>
        <button className="text-sm">Search</button>
        <button className="text-sm">Cart</button>
        <button className="text-sm">Profile</button>
      </div>
    );
  }
  return (
    <footer className="mt-10 py-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Brand. All rights reserved.
    </footer>
  );
}

function ProductsGridPlaceholder({ collection, limit, title, showPrice }: { 
  collection?: string; 
  limit?: number;
  title?: string;
  showPrice?: boolean;
}) {
  const n = Math.min(12, limit ?? 8);
  return (
    <section className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-center">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 mb-3 group-hover:scale-105 transition-transform" />
            <h3 className="font-medium mb-1">Product {i + 1}</h3>
            {showPrice && <p className="text-lg font-bold text-blue-600">$29.99</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function HorizontalProducts({ collection, limit, title }: {
  collection?: string;
  limit?: number;
  title?: string;
}) {
  const n = Math.min(8, limit ?? 6);
  return (
    <section className="space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48">
            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 mb-2" />
            <h3 className="font-medium text-sm">Product {i + 1}</h3>
            <p className="text-blue-600 font-bold">$29.99</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Category({ categories, layout, showImages }: {
  categories?: Array<{ name: string; image?: string; link?: string }>;
  layout?: 'grid' | 'list' | 'carousel';
  showImages?: boolean;
}) {
  const defaultCategories = [
    { name: "Electronics", image: "", link: "/category/electronics" },
    { name: "Clothing", image: "", link: "/category/clothing" },
    { name: "Home & Garden", image: "", link: "/category/home" },
    { name: "Sports", image: "", link: "/category/sports" },
  ];
  
  const items = categories || defaultCategories;
  
  if (layout === 'list') {
    return (
      <section className="space-y-2">
        {items.map((cat, i) => (
          <Link key={i} href={cat.link || "#"} className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center space-x-3">
              {showImages && <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg" />}
              <span className="font-medium">{cat.name}</span>
            </div>
          </Link>
        ))}
      </section>
    );
  }
  
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((cat, i) => (
        <Link key={i} href={cat.link || "#"} className="text-center group">
          {showImages && (
            <div className="aspect-square rounded-full bg-gray-100 dark:bg-gray-800 mb-3 group-hover:scale-105 transition-transform" />
          )}
          <span className="font-medium group-hover:text-blue-600">{cat.name}</span>
        </Link>
      ))}
    </section>
  );
}

function Banner({ imageUrl, link, title, subtitle, height }: { 
  imageUrl?: string; 
  link?: string;
  title?: string;
  subtitle?: string;
  height?: 'small' | 'medium' | 'large';
}) {
  const heightClass = {
    small: 'h-32',
    medium: 'h-48', 
    large: 'h-64'
  }[height || 'medium'];
  
  return (
    <Link href={link || "#"} className="block group">
      <div className={`${heightClass} w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
        {imageUrl && (
          <Image 
            src={imageUrl} 
            alt={title || "Banner"}
            fill
            className="object-cover"
          />
        )}
        {(title || subtitle) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
              {subtitle && <p className="text-lg">{subtitle}</p>}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function Divider({ style, color }: { style?: 'solid' | 'dashed' | 'dotted'; color?: string }) {
  return (
    <hr 
      className="my-8"
      style={{ 
        borderStyle: style || 'solid',
        borderColor: color || '#e5e7eb',
        borderWidth: '1px 0 0 0'
      }}
    />
  );
}

function Spacer({ height }: { height?: 'small' | 'medium' | 'large' }) {
  const heightClass = {
    small: 'h-4',
    medium: 'h-8',
    large: 'h-16'
  }[height || 'medium'];
  
  return <div className={heightClass} />;
}

function TextBlock({ content, alignment, size }: {
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
}) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  }[alignment || 'left'];
  
  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[size || 'medium'];
  
  return (
    <div className={`${alignClass} ${sizeClass} prose dark:prose-invert max-w-none`}>
      <div dangerouslySetInnerHTML={{ __html: content || "Add your text content here..." }} />
    </div>
  );
}

export function CmsRenderer({ layout, viewport }: { layout: CmsLayoutData; viewport?: 'mobile' | 'tablet' | 'desktop' }) {
  const [designColors, setDesignColors] = React.useState<{ header?: string; body?: string; footer?: string }>({});
  const [showAlignmentGuides, setShowAlignmentGuides] = React.useState<boolean>(false);

  // Keyboard shortcut to toggle alignment guides (G key)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'g' || event.key === 'G') {
        setShowAlignmentGuides(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('cmsDesignColors');
        if (raw) setDesignColors(JSON.parse(raw));
      } catch {}
    };
    read();
    const fn = () => read();
    window.addEventListener('cmsDesignColorsChanged', fn);
    return () => window.removeEventListener('cmsDesignColorsChanged', fn);
  }, []);

  // Listen for header changes coming from the settings panel (localStorage bridge)
  React.useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem('cmsHeaderState');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        // Nothing to set directly here because props come from layout,
        // but ensuring we re-render on event to pick up new layout state
        // when the parent updates.
      } catch {}
    };
    const handler = () => sync();
    window.addEventListener('cmsHeaderStateChanged', handler);
    return () => window.removeEventListener('cmsHeaderStateChanged', handler);
  }, []);

  return (
    <div className="h-full w-full flex flex-col relative" style={{ background: designColors.body || '#ffffff', minHeight: '100%' }}>
      {/* Alignment guide indicator */}
      {showAlignmentGuides && (
        <div className="fixed top-4 left-4 z-50 bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-lg">
          Alignment Guides Active (Press G to toggle)
        </div>
      )}
      
      {layout.blocks?.map((block: CmsBlock, index: number) => {
        const props = block.props as any;
        
        switch (block.type) {
          case "header":
            {
              const nav = props?.headerNav || props || {};
              const style = nav?.headerStyle || props?.headerStyle || {};
              const items = nav?.headerItems || props?.headerItems || {};
              return (
                <AppHeader
                  key={block.id}
                  variant={viewport === 'mobile' ? 'mobile' : 'desktop'}
                  viewport={viewport || 'desktop'}
                  left={(nav.left ?? props?.left ?? []).filter((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    return !meta || meta.enabled !== false;
                  }).map((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    if (it.type === 'logo' && (items as any).logo?.imageUrl) {
                      return { 
                        ...it, 
                        logoUrl: (items as any).logo.imageUrl,
                        heights: (items as any).logo.heights || meta?.heights,
                        // carry over meta so margins/padding/bg/radius work for logo too
                        width: meta?.width,
                        alignment: meta?.alignment,
                        margin: meta?.margin,
                        padding: meta?.padding,
                        borderRadius: meta?.borderRadius,
                        backgroundColor: meta?.backgroundColor,
                        itemSize: (meta as any)?.itemSize,
                      };
                    }
                    return meta ? { 
                      ...it, 
                      iconColor: meta.color, 
                      iconTransparency: meta.transparency, 
                      iconName: meta.iconName, 
                      iconSize: meta.iconSize,
                      itemTransparency: meta.transparency,
                      width: meta.width, 
                      heights: meta.heights,
                      alignment: meta.alignment,
                      margin: meta.margin,
                      padding: meta.padding,
                      borderRadius: meta.borderRadius,
                      backgroundColor: meta.backgroundColor,
                    } : it;
                  })}
                  center={(nav.center ?? props?.center ?? []).filter((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    return !meta || meta.enabled !== false;
                  }).map((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    if (it.type === 'logo' && (items as any).logo?.imageUrl) {
                      return { 
                        ...it, 
                        logoUrl: (items as any).logo.imageUrl,
                        heights: (items as any).logo.heights || meta?.heights,
                        width: meta?.width,
                        alignment: meta?.alignment,
                        margin: meta?.margin,
                        padding: meta?.padding,
                        borderRadius: meta?.borderRadius,
                        backgroundColor: meta?.backgroundColor,
                        itemSize: (meta as any)?.itemSize,
                      };
                    }
                    return meta ? { 
                      ...it, 
                      iconColor: meta.color, 
                      iconTransparency: meta.transparency, 
                      iconName: meta.iconName, 
                      iconSize: meta.iconSize,
                      itemTransparency: meta.transparency,
                      width: meta.width, 
                      heights: meta.heights,
                      alignment: meta.alignment,
                      margin: meta.margin,
                      padding: meta.padding,
                      borderRadius: meta.borderRadius,
                      backgroundColor: meta.backgroundColor,
                    } : it;
                  })}
                  right={(nav.right ?? props?.right ?? []).filter((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    return !meta || meta.enabled !== false;
                  }).map((it:any)=>{
                    const meta = items[it.type as keyof typeof items];
                    if (it.type === 'logo' && (items as any).logo?.imageUrl) {
                      return {
                        ...it,
                        logoUrl: (items as any).logo.imageUrl,
                        heights: (items as any).logo.heights || meta?.heights,
                        width: meta?.width,
                        alignment: meta?.alignment,
                        margin: meta?.margin,
                        padding: meta?.padding,
                        borderRadius: meta?.borderRadius,
                        backgroundColor: meta?.backgroundColor,
                        itemSize: (meta as any)?.itemSize,
                      };
                    }
                    return meta ? { 
                      ...it, 
                      iconColor: meta.color, 
                      iconTransparency: meta.transparency, 
                      iconName: meta.iconName, 
                      iconSize: meta.iconSize,
                      itemTransparency: meta.transparency,
                      width: meta.width, 
                      heights: meta.heights,
                      alignment: meta.alignment,
                      margin: meta.margin,
                      padding: meta.padding,
                      borderRadius: meta.borderRadius,
                      backgroundColor: meta.backgroundColor,
                    } : it;
                  })}
                  menuItems={nav.menuItems ?? props?.menuItems ?? []}
                  mobileCollapsed={nav.mobileCollapsed ?? true}
                  brandText={nav.brandText || ''}
                  enableAppBar={!!nav.enableAppBar}
                  alwaysShowAppBar={!!nav.alwaysShowAppBar}
                  backgroundColor={style.gradientEnabled ? undefined : (style.backgroundColor || designColors.header || nav.backgroundColor)}
                  elevation={typeof nav.elevation === 'number' ? nav.elevation : 0}
                  pinned={!!nav.pinned}
                  forceLight={true}
                  headerStyle={style}
                  showAlignmentGuides={showAlignmentGuides}
                />
              );
            }
          case "footer":
            return (
              <div key={block.id} style={{ background: designColors.footer || '#ffffff', width: '100%' }}>
                <AppFooter variant={(viewport === 'mobile' ? 'mobile' : 'desktop')} {...props} />
              </div>
            );
          case "hero":
            return <Hero key={block.id} {...props} />;
          case "headerSearch":
            return <HeaderSearch key={block.id} {...props} />;
          case "products":
            return <ProductsGridPlaceholder key={block.id} {...props} />;
          case "horizontalProducts":
            return <HorizontalProducts key={block.id} {...props} />;
          case "headerView":
            return (
              <div key={block.id} className="p-4 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Header View</div>
                  <div className="font-medium">{props?.text || "Header"}</div>
                </div>
                <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">{props?.actionText || "Action"}</button>
              </div>
            );
          case "instagramStory":
            return (
              <div key={block.id} className="p-4 rounded bg-gray-100 dark:bg-gray-800">
                <div className="text-sm text-gray-500 mb-2">Instagram Story</div>
                <div className="flex gap-3 overflow-x-auto">
                  {Array.from({ length: Math.max(5, (props?.items?.length || 0)) }).map((_, i) => (
                    <div key={i} className="w-20 h-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </div>
            );
          case "bannerImage":
            return <Banner key={block.id} imageUrl={props?.images?.[0]?.url || props?.imageUrl} title={props?.title} subtitle={props?.subtitle} height={props?.height} />;
          case "blogs":
          case "dynamicBlog":
            return (
              <div key={block.id} className="p-6 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm">
                {block.type === 'blogs' ? 'Blogs widget' : 'Dynamic Blog widget'} preview
              </div>
            );
          case "button":
            return (
              <div key={block.id} className="flex justify-center">
                <button className="px-4 py-2 rounded bg-blue-600 text-white">{props?.text || 'Button'}</button>
              </div>
            );
          case "category":
            return <Category key={block.id} {...props} />;
          case "banner":
            return <Banner key={block.id} {...props} />;
          case "divider":
            return <Divider key={block.id} {...props} />;
          case "spacer":
            return <Spacer key={block.id} {...props} />;
          case "text":
            return <TextBlock key={block.id} {...props} />;
          case "carousel":
            return (
              <div key={block.id} className="h-40 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <span className="text-gray-500">Carousel Component</span>
              </div>
            );
          case "html":
            return (
              <div key={block.id} className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: String(props?.html || "") }} />
            );
          default:
            return (
              <div key={block.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-500">Unknown component: {block.type}</span>
              </div>
            );
        }
      })}
      {/* Spacer to ensure body area is visible */}
      <div className="flex-1 min-h-[200px]" style={{ background: 'transparent' }}></div>
    </div>
  );
}


