"use client";

export interface ButtonItem {
  id: string;
  buttonType: 'text' | 'image';
  text?: string;
  textColor?: string;
  fontSize?: number;
  backgroundColor?: string;
  useMaxWidth?: boolean;
  width?: number;
  height?: number;
  borderRadius?: number;
  marginLeft?: number;
  marginRight?: number;
  action?: string;
}

export interface CategoryItem {
  id: string;
  imageUrl?: string;
  category?: string;
  showFeatured?: boolean;
  onlyOnSale?: boolean;
  orderBy?: 'none' | 'name' | 'date';
  order?: 'none' | 'asc' | 'desc';
  keepOriginalColor?: boolean;
  backgroundColor?: string;
  overrideNewLabel?: boolean;
}

export interface WidgetConfig {
  title: string;
  subtitle?: string;
  badge?: string;
  height?: number;
  clipBorderRadius?: number;
  delayStart?: number;
  autoPlay?: boolean;
  action?: string;
  padding?: { start: number; end: number; top: number; bottom: number };
  margin?: { start: number; end: number; top: number; bottom: number };
  background?: boolean;
  decoration?: boolean;
  responsive?: Record<'mobile' | 'tablet' | 'desktop', Partial<WidgetConfig>>;
  // Generic type tag
  type?: string;

  // Banner image
  bannerType?: 'static' | 'horizontal' | 'slider' | 'swiper' | 'tinder' | 'stack' | 'custom';
  imageResize?: 'FITWIDTH' | 'FITHEIGHT' | 'FILL' | 'ORIGINAL';
  useDefaultHeight?: boolean;
  parallaxEffect?: boolean;
  boxShadow?: boolean;
  images?: Array<{ id: string; url: string; link?: string; title?: string; subtitle?: string }>;
  headerEnabled?: boolean;
  header?: {
    enableSearchButton?: boolean;
    safearea?: boolean;
    type?: 'Static' | 'Dynamic';
    text?: string;
    height?: number;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
    font?: string;
    fontSize?: number;
    fontWeight?: number;
    textOpacity?: number;
    textColor?: string;
  };

  // Blogs
  blogs?: {
    label?: string;
    backgroundColor?: string;
    itemColor?: string;
    radius?: number;
    padding?: number;
    innerPadding?: number;
    hideTitle?: boolean;
    hideAuthor?: boolean;
    hideComment?: boolean;
    hideDate?: boolean;
    autoSliding?: boolean;
  };

  // Button widget
  button?: {
    alignment?: 'topLeft' | 'topCenter' | 'topRight';
    marginTop?: number;
    marginBottom?: number;
    items?: Array<ButtonItem>;
  };

  // Divider
  divider?: {
    thickness?: number;
    indent?: number;
    endIndent?: number;
    color?: string;
  };

  // Category widget
  category?: {
    style?: 'icon' | 'image' | 'text' | 'menu';
    data?: CategoryItem[];
    gradientStyle?: boolean;
    horizontalMode?: boolean;
    hideBackground?: boolean;
    hideItemLabel?: boolean;
    enableWrapMode?: boolean;
    separateWidth?: number;
    size?: number;
    spacing?: number;
    radius?: number;
    paddingX?: number;
    paddingY?: number;
    marginX?: number;
    marginY?: number;
    iconBorderWidth?: number;
    iconBorderStyle?: 'solid' | 'dashed' | 'dotted';
    iconBorderSpacing?: number;
    iconBorderColor?: string;
    labelFontSize?: number;
    boxShadowEnabled?: boolean;
    boxShadowBlur?: number;
    boxShadowOpacity?: number;
    boxShadowOffsetX?: number;
    boxShadowOffsetY?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    useWrapMode?: boolean;
    useGradient?: boolean;
    useColumn?: boolean;
    enableBorder?: boolean;
    border?: number;
    textAlignment?: 'topLeft' | 'topCenter' | 'topRight';
    imagePaddingX?: number;
    imagePaddingY?: number;
    imageMarginX?: number;
    imageMarginY?: number;
    imageWidth?: number;
    imageHeight?: number;
    imageRadius?: number;
    imageBoxFit?: 'cover' | 'contain' | 'fill' | 'none';
    imageBorderWidth?: number;
    imageBorderStyle?: 'solid' | 'dashed' | 'dotted';
    imageBorderSpacing?: number;
    imageBorderColor?: string;
  };

  // Dynamic Blog
  dynamicBlog?: {
    label?: string;
    layout?: 'two' | 'three' | 'four' | 'staggered' | 'card' | 'bannerSlider' | 'carousel';
    cardLayout?: 'simple' | 'background';
    stickyScrolling?: boolean;
    autoSliding?: boolean;
    category?: string;
    orderBy?: 'none' | 'date' | 'title';
    order?: 'none' | 'asc' | 'desc';
    customizeLimit?: boolean;
    limit?: number;
  };

  // Header Search
  headerSearch?: {
    text?: string;
    fontSize?: number;
    textColor?: string;
    textOpacity?: number; // 0 - 1
    height?: number;
    radius?: number;
    backgroundColor?: string;
    usePrimaryColorLight?: boolean;
    outsideColor?: string;
    showBorder?: boolean;
    // Box shadow
    boxShadowEnabled?: boolean;
    boxShadowSpread?: number;
    boxShadowBlur?: number;
    boxShadowOpacity?: number;
    boxShadowOffsetX?: number;
    boxShadowOffsetY?: number;
    // Margin
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    // Padding
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };

  // Header View (CTA bar with navigation actions)
  headerView?: {
    text?: string;
    actionText?: string;
    actionType?: 'none' | 'product' | 'categoryTag' | 'screen' | 'tab' | 'tabNumber' | 'webview' | 'external' | 'blog' | 'blogCategory' | 'coupon';
    // Per-action extras
    product?: string;
    category?: string;
    screen?: string;
    fullScreen?: boolean;
    tab?: string;
    tabNumber?: number;
    url?: string;
    urlTitle?: string;
    enableForward?: boolean;
    enableBackward?: boolean;
    urlLaunch?: string;
    blog?: string;
    blogCategory?: string;
    coupon?: string;
    countdown?: string; // ISO date
    // Spacing
    marginStart?: number; marginEnd?: number; marginTop?: number; marginBottom?: number;
    paddingStart?: number; paddingEnd?: number; paddingTop?: number; paddingBottom?: number;
  };

  // Horizontal Products (PRODUCTS) widget
  horizontalProducts?: {
    // Data
    header?: string;
    useSpecialProducts?: boolean;
    category?: string;
    // Type/layout
    layout?: 'twoColumn' | 'threeColumn' | 'fourColumn' | 'recentView' | 'card' | 'staggered' | 'saleOff' | 'listTile' | 'simpleList' | 'largeCard' | 'quiltedGridTile' | 'bannerSlider' | 'carousel';
    // Product card options
    imageBoxFit?: 'COVER' | 'CONTAIN' | 'FILL' | 'NONE';
    minHeight?: number;
    cardDesign?: 'card' | 'plain' | 'outline';
    cardRadius?: number;
    showImageWithCircularRadius?: boolean;
    imageRatio?: number;
    showTitle?: boolean;
    titleMaxLine?: number;
    showPricing?: boolean;
    showStockStatus?: boolean;
    enableRating?: boolean;
    showHeartIcon?: boolean;
    cartBottomSheet?: boolean;
    showCartQuantity?: boolean;
    showCartButton?: boolean;
    showCartIcon?: boolean;
    cartIconColor?: string;
    // Product card shadow
    cardShadowEnabled?: boolean;
    // Horizontal options
    rows?: number;
    horizontalMargin?: number;
    verticalMargin?: number;
    horizontalPadding?: number;
    verticalPadding?: number;
    // Settings
    showFeaturedProducts?: boolean;
    enableStickyScrolling?: boolean;
    onlyOnSale?: boolean;
    orderBy?: 'none' | 'title' | 'popularity' | 'rating' | 'date' | 'price' | 'menu_order' | 'rand';
    order?: 'none' | 'asc' | 'desc';
    customizeLimitProducts?: boolean;
    enableAutoSliding?: boolean;
    // Background
    backgroundColor?: string;
    backgroundBorderRadius?: number;
    backgroundImageUrl?: string;
    backgroundImageBoxFit?: 'COVER' | 'CONTAIN' | 'FILL' | 'NONE';
    enableParallaxEffect?: boolean;
    customizeSpace?: boolean;
    useMaxWidth?: boolean;
    customizeWidth?: boolean;
    customizeHeight?: boolean;
    marginLeft?: number; marginRight?: number; marginTop?: number; marginBottom?: number;
  };

  // Instagram Story widget
  instagramStory?: {
    items?: Array<{
      id: string;
      imageUrl?: string;
      avatarUrl?: string;
      codeEmbed?: string;
      videoLink?: string;
      mediaCaption?: string;
    }>;
    // Item Settings
    width?: number;
    height?: number;
    radius?: number;
    hideAvatar?: boolean;
    hideCaption?: boolean;
    // Settings
    limitItem?: number;
    spacingItem?: number;
    timeView?: number;
    viewLayout?: 'iframe' | 'media' | 'mediaWithCap';
    // Margin
    marginLeft?: number; marginRight?: number; marginTop?: number; marginBottom?: number;
  };

  // List Card widget
  listCard?: {
    title?: string;
    subtitle?: string;
    cardCount?: number;
    spacing?: number;
    showImage?: boolean;
    showDescription?: boolean;
    marginLeft?: number; marginRight?: number; marginTop?: number; marginBottom?: number;
  };
}


