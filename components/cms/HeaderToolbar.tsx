import { ChevronDownIcon, ChevronLeftIcon } from './icons';
import { getLayoutIcon, layoutOptions, deviceSizes } from './utils';

interface HeaderToolbarProps {
  device: 'mobile' | 'tablet' | 'desktop';
  setDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onSave: () => void;
  onPublish: () => void;
  rightView: string;
  setRightView: (view: string) => void;
}

export function HeaderToolbar({ 
  device, 
  setDevice, 
  onSave, 
  onPublish, 
  rightView, 
  setRightView 
}: HeaderToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setRightView('builder')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeftIcon />
          <span>Back to Builder</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Device:</span>
          <div className="relative">
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value as 'mobile' | 'tablet' | 'desktop')}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
              <option value="desktop">Desktop</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={onPublish}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
