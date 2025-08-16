import { 
  GridIcon, LayoutIcon, SearchIcon, ShoppingCartIcon, 
  FileTextIcon, ListIcon 
} from './icons';

interface SidebarProps {
  rightView: string;
  setRightView: (view: string) => void;
}

export function Sidebar({ rightView, setRightView }: SidebarProps) {
  const menuItems = [
    { id: 'builder', icon: <GridIcon />, label: 'Builder', active: rightView === 'builder' },
    { id: 'category', icon: <LayoutIcon />, label: 'Categories', active: rightView === 'category' },
    { id: 'search', icon: <SearchIcon />, label: 'Search', active: rightView === 'search' },
    { id: 'cart', icon: <ShoppingCartIcon />, label: 'Cart', active: rightView === 'cart' },
    { id: 'listBlog', icon: <ListIcon />, label: 'Blog', active: rightView === 'listBlog' },
    { id: 'page', icon: <FileTextIcon />, label: 'Pages', active: rightView === 'page' },
  ];

  return (
    <aside className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setRightView(item.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            item.active 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </aside>
  );
}
