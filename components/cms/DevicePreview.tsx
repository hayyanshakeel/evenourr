import { deviceSizes } from './utils';
import { CmsLayoutData } from '@/lib/cms/schema';
import { CmsRenderer } from '@/components/cms/Renderer';

interface DevicePreviewProps {
  device: 'mobile' | 'tablet' | 'desktop';
  layout: any[];
  selectedElement: number | null;
  setSelectedElement: (index: number | null) => void;
  isDragging: boolean;
  draggedElement: any;
  setLayout: (layout: any[]) => void;
  cmsLayout?: CmsLayoutData;
  showEmptyState?: boolean;
}

export function DevicePreview({
  device,
  layout,
  selectedElement,
  setSelectedElement,
  isDragging,
  draggedElement,
  setLayout,
  cmsLayout,
  showEmptyState = true
}: DevicePreviewProps) {
  const size = deviceSizes[device];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    if (!draggedElement) return;

    const newElement = {
      id: Date.now(),
      type: draggedElement.type,
      content: draggedElement.content || '',
      style: draggedElement.style || {}
    };

    const newLayout = [...layout];
    if (typeof targetIndex === 'number') {
      newLayout.splice(targetIndex, 0, newElement);
    } else {
      newLayout.push(newElement);
    }

    setLayout(newLayout);
  };

  const renderElement = (element: any, index: number) => {
    const isSelected = selectedElement === index;
    
    const baseClasses = `relative border-2 transition-all cursor-pointer ${
      isSelected 
        ? 'border-primary/70 bg-primary/10' 
        : 'border-transparent hover:border-border'
    }`;

    const content = (() => {
      switch (element.type) {
        case 'hero':
          return (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Hero Section</h1>
              <p className="text-lg opacity-90">Compelling headline goes here</p>
              <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold">
                Call to Action
              </button>
            </div>
          );
        case 'headerSearch':
          return (
            <div className="bg-card p-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="font-bold text-xl text-foreground">Logo</div>
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-foreground">Cart (0)</button>
                  <button className="p-2 text-foreground">Login</button>
                </div>
              </div>
            </div>
          );
        case 'headerView':
          return (
            <div className="p-4 bg-muted border-b border-border flex items-center justify-between">
              <div className="font-semibold">{element.content || 'Header View'}</div>
              <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Action</button>
            </div>
          );
        case 'horizontalProducts':
          return (
            <div className="p-4">
              <div className="font-semibold mb-2">Horizontal Products</div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-40 flex-shrink-0 border border-border rounded-lg overflow-hidden bg-card">
                    <div className="h-24 bg-muted" />
                    <div className="p-2 text-sm">
                      <div className="font-medium text-foreground">Product {i}</div>
                      <div className="text-primary">$29.99</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'instagramStory':
          return (
            <div className="p-4">
              <div className="font-semibold mb-2">Instagram Story</div>
              <div className="flex gap-3 overflow-x-auto">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-20 h-32 flex-shrink-0 rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          );
        case 'listCard':
          return (
            <div className="p-4">
              <div className="font-semibold mb-3">List Card</div>
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="p-3 border border-border rounded-lg flex items-center gap-3 bg-card">
                    <div className="w-10 h-10 rounded bg-muted" />
                    <div>
                      <div className="font-medium text-sm text-foreground">Item {i}</div>
                      <div className="text-xs text-muted-foreground">Subtitle</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'blogs':
          return (
            <div className="p-4">
              <div className="font-semibold mb-2">Blogs</div>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="h-20 bg-muted" />
                    <div className="p-2 text-sm text-foreground">Blog title {i}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'dynamicBlog':
          return (
            <div className="p-4">
              <div className="font-semibold mb-2">Dynamic Blog</div>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="h-20 bg-muted" />
                    <div className="p-2 text-sm text-foreground">Post {i}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'button':
          return (
            <div className="p-4 flex justify-center">
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground">Button</button>
            </div>
          );
        case 'bannerImage':
          return (
            <div className="h-28 bg-muted flex items-center justify-center text-foreground">Banner Image</div>
          );
        case 'category':
          return (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Electronics', 'Clothing', 'Books', 'Home'].map((cat) => (
                  <div key={cat} className="bg-muted p-4 rounded-lg text-center border border-border">
                    <div className="w-12 h-12 bg-muted-foreground/20 rounded-full mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-foreground">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'products':
          return (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="w-full h-32 bg-muted"></div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground">Product {i}</h3>
                      <p className="text-primary">$99.99</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'banner':
          return (
            <div className="bg-accent p-4 text-center border border-border">
              <h3 className="font-bold text-lg text-accent-foreground">Special Offer!</h3>
              <p className="text-sm text-accent-foreground/90">Get 20% off your first order</p>
            </div>
          );
        case 'text':
          return (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">Text Block</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is a text block component. You can add any content here, including
                paragraphs, lists, and other text formatting.
              </p>
            </div>
          );
        case 'spacer':
          return <div className="h-8 bg-muted border-dashed border-2 border-border flex items-center justify-center text-muted-foreground text-sm">Spacer</div>;
        case 'divider':
          return <hr className="border-border" />;
        default:
          return (
            <div className="p-4 bg-muted text-center border border-border">
              <span className="text-muted-foreground">Unknown element: {element.type}</span>
            </div>
          );
      }
    })();

    return (
      <div
        key={element.id || index}
        className={baseClasses}
        onClick={() => setSelectedElement(selectedElement === index ? null : index)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.stopPropagation();
          handleDrop(e, index);
        }}
      >
        {content}
        {isSelected && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs">
            Selected
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="w-full h-full"
      style={{
        // Force a light palette inside the device preview regardless of app theme
        ['--background' as any]: '0 0% 100%',
        ['--card' as any]: '0 0% 100%',
        ['--foreground' as any]: '224 71.4% 4.1%',
        ['--muted' as any]: '210 40% 96.1%',
        ['--muted-foreground' as any]: '215.4 16.3% 46.9%',
        ['--border' as any]: '0 0% 90%',
        ['--accent' as any]: '210 40% 96.1%',
        ['--accent-foreground' as any]: '222.2 47.4% 11.2%',
        ['--primary' as any]: '221.2 83.2% 53.3%',
        ['--primary-foreground' as any]: '210 40% 98%'
      } as React.CSSProperties}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
          {cmsLayout ? (
            <div className="h-full overflow-y-auto">
              <CmsRenderer layout={cmsLayout} viewport={device} />
            </div>
          ) : layout.length === 0 ? (
            showEmptyState ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-lg font-medium text-foreground">Start Building</p>
                  <p className="text-sm text-muted-foreground">Drag components from the sidebar to begin</p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full" />
            )
          ) : (
            <div className="h-full overflow-y-auto">
              {layout.map((element, index) => renderElement(element, index))}
            </div>
          )}
          
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
                <p className="text-primary font-medium">Drop here to add component</p>
              </div>
            </div>
          )}
    </div>
  );
}
