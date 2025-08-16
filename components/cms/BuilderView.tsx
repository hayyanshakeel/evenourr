import { useState } from 'react';
import { getLayoutIcon, layoutOptions } from './utils';
import { TrashIcon, ChevronDownIcon } from './icons';

interface BuilderViewProps {
  layout: any[];
  setLayout: (layout: any[]) => void;
  selectedElement: number | null;
  setSelectedElement: (index: number | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedElement: any;
  setDraggedElement: (element: any) => void;
}

export function BuilderView({
  layout,
  setLayout,
  selectedElement,
  setSelectedElement,
  isDragging,
  setIsDragging,
  draggedElement,
  setDraggedElement
}: BuilderViewProps) {
  const [isLayoutOpen, setIsLayoutOpen] = useState(true);

  const handleDragStart = (e: React.DragEvent, element: any) => {
    setDraggedElement(element);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

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
    setIsDragging(false);
    setDraggedElement(null);
  };

  const removeElement = (index: number) => {
    const newLayout = layout.filter((_, i) => i !== index);
    setLayout(newLayout);
    if (selectedElement === index) {
      setSelectedElement(null);
    }
  };

  const moveElement = (fromIndex: number, toIndex: number) => {
    const newLayout = [...layout];
    const [movedElement] = newLayout.splice(fromIndex, 1);
    newLayout.splice(toIndex, 0, movedElement);
    setLayout(newLayout);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Layout Components Section */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsLayoutOpen(!isLayoutOpen)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-900 mb-3"
        >
          Layout Components
          <ChevronDownIcon className={`transform transition-transform ${
            isLayoutOpen ? 'rotate-180' : ''
          }`} />
        </button>
        
        {isLayoutOpen && (
          <div className="space-y-2">
            {layoutOptions.map((option) => (
              <div
                key={option.type}
                draggable
                onDragStart={(e) => handleDragStart(e, { type: option.type })}
                onDragEnd={handleDragEnd}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-grab active:cursor-grabbing transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getLayoutIcon(option.type)}
                  <span className="text-sm font-medium">{option.name}</span>
                </div>
                {option.badge && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Layout Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Current Layout</h3>
        <div
          className="space-y-2 min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-3"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {layout.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Drag components here to build your page</p>
            </div>
          ) : (
            layout.map((element, index) => (
              <div
                key={element.id || index}
                className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition-colors ${
                  selectedElement === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
                <div className="flex items-center space-x-2">
                  {getLayoutIcon(element.type)}
                  <span className="text-sm font-medium">
                    {layoutOptions.find(opt => opt.type === element.type)?.name || element.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) moveElement(index, index - 1);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < layout.length - 1) moveElement(index, index + 1);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    disabled={index === layout.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(index);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
