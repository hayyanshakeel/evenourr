"use client";

import { useRef, useState } from "react";

import TopToolbar from "@/components/cms/TopToolbar";
import MainCanvas from "@/components/cms/MainCanvas";
import RightPanel from "@/components/cms/RightPanel";

type RightView = 'builder' | 'search' | 'cart' | 'listBlog' | 'page' | 'header' | 'footer';

export default function CMSPage() {
  const [rightView, setRightView] = useState<RightView>('header');
  const asideRef = useRef<HTMLDivElement>(null!);
  const [showSeeAll, setShowSeeAll] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [editorLayoutItems, setEditorLayoutItems] = useState<any[]>([]);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#000' }}>
      <TopToolbar viewport={viewport} setViewport={setViewport} />
      <div className="flex flex-1 overflow-hidden" style={{ paddingRight: 420, backgroundColor: '#000' }}>
        <div className="flex flex-1 items-start p-6" style={{ backgroundColor: '#000' }}>
          <MainCanvas setShowSeeAll={setShowSeeAll} viewport={viewport} editorLayout={editorLayoutItems} />
        </div>
        <RightPanel
          asideRef={asideRef}
          rightView={rightView}
          setRightView={(view) => setRightView(view as RightView)}
          viewport={viewport}
          onLayoutChange={setEditorLayoutItems}
        />
      </div>
    </div>
  );
}
