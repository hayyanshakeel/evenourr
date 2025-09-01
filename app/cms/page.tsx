"use client";

import { useRef, useState, useEffect } from "react";

import TopToolbar from "@/components/cms/TopToolbar";
import MainCanvas from "@/components/cms/MainCanvas";
import RightPanel from "@/components/cms/RightPanel";

type RightView = 'builder' | 'search' | 'cart' | 'listBlog' | 'page' | 'header' | 'footer' | 'category';

export default function CMSPage() {
  const [rightView, setRightView] = useState<RightView>('header');
  const asideRef = useRef<HTMLDivElement>(null!);
  const [showSeeAll, setShowSeeAll] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [editorLayoutItems, setEditorLayoutItems] = useState<any[]>([]);
  const [categoryLayoutActive, setCategoryLayoutActive] = useState(false);
  const [currentPageType, setCurrentPageType] = useState<string>('home');
  const [activePageId, setActivePageId] = useState<string>('home');

  // Handle category layout changes
  const handleCategoryLayoutChange = (layoutName: string, layoutData: any) => {
    // Convert category layout data to editor layout format
    const editorLayout = [{
      title: 'Category Layout',
      type: 'category',
      template: layoutName,
      ...layoutData
    }];
    
    setEditorLayoutItems(editorLayout);
    setCategoryLayoutActive(true);
  };

  // Listen for category layout changes from localStorage
  useEffect(() => {
    const handleStorageEvent = () => {
      try {
        const layoutData = localStorage.getItem('cmsCategoryLayout');
        const isActive = localStorage.getItem('cmsCategoryLayoutActive');
        
        if (layoutData && isActive === 'true') {
          const parsed = JSON.parse(layoutData);
          handleCategoryLayoutChange(parsed.template || 'aurion', parsed);
        }
      } catch {}
    };

    window.addEventListener('cmsCategoryLayoutChanged', handleStorageEvent);
    
    // Check on mount
    handleStorageEvent();

    return () => {
      window.removeEventListener('cmsCategoryLayoutChanged', handleStorageEvent);
    };
  }, []);

  // Listen for active page changes
  useEffect(() => {
    const handlePageChange = () => {
      try {
        const savedPageId = localStorage.getItem('cmsActivePageId');
        const savedPages = localStorage.getItem('cmsPages');
        
        if (savedPageId && savedPages) {
          const pages = JSON.parse(savedPages);
          const currentPage = pages.find((p: any) => p.id === savedPageId);
          
          if (currentPage) {
            setActivePageId(savedPageId);
            setCurrentPageType(currentPage.type || 'home');
            
            // Reset category layout when switching away from category page
            if (currentPage.type !== 'category') {
              setCategoryLayoutActive(false);
              localStorage.removeItem('cmsCategoryLayoutActive');
            }
          }
        }
      } catch {}
    };

    // Listen for page changes - both storage events and custom events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cmsActivePageId' || e.key === 'cmsPages') {
        setTimeout(handlePageChange, 10); // Small delay to ensure localStorage is updated
      }
    };

    const handleCustomPageChange = () => {
      setTimeout(handlePageChange, 10);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cmsPageChanged', handleCustomPageChange);
    
    // Check on mount and periodically
    handlePageChange();
    const interval = setInterval(handlePageChange, 500); // Check every 500ms for updates

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cmsPageChanged', handleCustomPageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#000' }}>
      <TopToolbar viewport={viewport} setViewport={setViewport} />
      <div className="flex flex-1 overflow-hidden" style={{ paddingRight: 420, backgroundColor: '#000' }}>
        <div className="flex flex-1 items-start p-6" style={{ backgroundColor: '#000' }}>
          <MainCanvas 
            setShowSeeAll={setShowSeeAll} 
            viewport={viewport} 
            editorLayout={editorLayoutItems}
            categoryLayoutActive={categoryLayoutActive} 
            currentPageType={currentPageType}
            activePageId={activePageId}
          />
        </div>
        <RightPanel
          asideRef={asideRef}
          rightView={rightView}
          setRightView={(view) => setRightView(view as RightView)}
          viewport={viewport}
          onLayoutChange={setEditorLayoutItems}
          onCategoryLayoutChange={handleCategoryLayoutChange}
        />
      </div>
    </div>
  );
}
