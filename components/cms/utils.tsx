import { 
  SearchIcon, ZapIcon, LayersIcon, ShoppingCartIcon, 
  LayoutIcon, FileTextIcon 
} from './icons';

export function getLayoutIcon(type: string) {
  switch (type) {
    case 'headerSearch': return <SearchIcon />;
    case 'hero': return <ZapIcon />;
    case 'category': return <LayersIcon />;
    case 'horizontalProducts': return <ShoppingCartIcon />;
    case 'logo': return <LayoutIcon />;
    case 'products': return <ShoppingCartIcon />;
    case 'banner': return <LayoutIcon />;
    case 'text': return <FileTextIcon />;
    case 'spacer': return <LayoutIcon />;
    case 'divider': return <LayoutIcon />;
    default: return <LayoutIcon />;
  }
}

export const layoutOptions = [
  { type: 'hero', name: 'Hero Section', badge: 'New!' },
  { type: 'headerSearch', name: 'Header Search' },
  { type: 'category', name: 'Category Grid' },
  { type: 'products', name: 'Product List' },
  { type: 'banner', name: 'Banner' },
  { type: 'text', name: 'Text Block' },
  { type: 'spacer', name: 'Spacer' },
  { type: 'divider', name: 'Divider' },
];

export const deviceSizes = {
  mobile: { w: 375, h: 667 },
  tablet: { w: 768, h: 1024 },
  desktop: { w: 1200, h: 800 },
};
