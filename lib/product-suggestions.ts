// Auto-suggestion data for product variants, categories, and collections

export const COLOR_SUGGESTIONS = [
  'Black', 'White', 'Gray', 'Grey', 'Red', 'Blue', 'Navy', 'Green', 'Yellow',
  'Orange', 'Purple', 'Pink', 'Brown', 'Beige', 'Tan', 'Cream', 'Ivory',
  'Maroon', 'Burgundy', 'Crimson', 'Rose', 'Coral', 'Salmon', 'Peach',
  'Gold', 'Silver', 'Bronze', 'Copper', 'Platinum', 'Charcoal', 'Slate',
  'Olive', 'Forest', 'Emerald', 'Teal', 'Turquoise', 'Aqua', 'Cyan',
  'Royal Blue', 'Sky Blue', 'Light Blue', 'Dark Blue', 'Indigo', 'Violet',
  'Lavender', 'Magenta', 'Fuchsia', 'Hot Pink', 'Light Pink', 'Dark Pink'
];

export const SIZE_SUGGESTIONS = [
  // Clothing sizes
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '2XS', '3XS', '2XL', '3XL', '4XL', '5XL',
  // Numeric sizes
  '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
  // Women's sizes
  '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24',
  // Shoe sizes
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', 
  '11', '11.5', '12', '12.5', '13', '13.5', '14', '15',
  // Generic sizes
  'One Size', 'Free Size', 'Universal'
];

export const MATERIAL_SUGGESTIONS = [
  'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather',
  'Suede', 'Canvas', 'Nylon', 'Spandex', 'Rayon', 'Bamboo', 'Cashmere',
  'Fleece', 'Jersey', 'Mesh', 'Velvet', 'Corduroy', 'Tweed', 'Chiffon'
];

export const STYLE_SUGGESTIONS = [
  'Casual', 'Formal', 'Business', 'Athletic', 'Vintage', 'Modern', 'Classic',
  'Trendy', 'Bohemian', 'Minimalist', 'Oversized', 'Fitted', 'Relaxed',
  'Slim Fit', 'Regular Fit', 'Straight', 'Skinny', 'Wide Leg', 'Bootcut'
];

export const CATEGORY_SUGGESTIONS = [
  'Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Watches',
  'Electronics', 'Home & Garden', 'Sports & Outdoors', 'Beauty & Health',
  'Books', 'Toys & Games', 'Automotive', 'Pet Supplies', 'Office Supplies'
];

export const COLLECTION_SUGGESTIONS = [
  'New Arrivals', 'Best Sellers', 'Sale', 'Clearance', 'Featured',
  'Spring Collection', 'Summer Collection', 'Fall Collection', 'Winter Collection',
  'Holiday Special', 'Limited Edition', 'Premium', 'Essentials', 'Basics',
  'Trending Now', 'Staff Picks', 'Customer Favorites'
];

// Auto-categorization rules based on tags
export const AUTO_CATEGORIZATION_RULES = {
  categories: {
    'Clothing': ['shirt', 'pants', 'dress', 'jacket', 'coat', 'sweater', 'hoodie', 'jeans', 'shorts', 'skirt', 'blouse', 't-shirt', 'tank', 'cardigan'],
    'Shoes': ['shoes', 'boots', 'sneakers', 'sandals', 'heels', 'flats', 'loafers', 'oxfords', 'athletic', 'running'],
    'Accessories': ['hat', 'cap', 'scarf', 'belt', 'gloves', 'sunglasses', 'wallet', 'purse', 'tie', 'bow tie'],
    'Bags': ['bag', 'backpack', 'handbag', 'tote', 'clutch', 'messenger', 'duffel', 'briefcase', 'satchel'],
    'Jewelry': ['necklace', 'bracelet', 'ring', 'earrings', 'pendant', 'chain', 'watch', 'brooch'],
    'Sports & Outdoors': ['athletic', 'sports', 'fitness', 'yoga', 'running', 'hiking', 'outdoor', 'activewear']
  },
  collections: {
    'Denim Collection': ['denim', 'jeans', 'jean', 'denim jacket', 'denim shirt'],
    'Formal Wear': ['formal', 'business', 'suit', 'blazer', 'dress shirt', 'tie', 'formal shoes'],
    'Casual Wear': ['casual', 't-shirt', 'jeans', 'sneakers', 'hoodie', 'sweatshirt'],
    'Athletic Wear': ['athletic', 'sports', 'workout', 'gym', 'running', 'fitness', 'activewear'],
    'Winter Collection': ['winter', 'warm', 'coat', 'jacket', 'sweater', 'boots', 'scarf', 'gloves'],
    'Summer Collection': ['summer', 'light', 'shorts', 'tank', 'sandals', 'swimwear', 'sundress'],
    'Premium Collection': ['premium', 'luxury', 'high-end', 'designer', 'exclusive'],
    'Sale Items': ['sale', 'clearance', 'discount', 'reduced', 'marked down']
  }
};

// Function to get suggestions based on option name
export const getSuggestions = (optionName: string): string[] => {
  const lowerName = optionName.toLowerCase();
  
  if (lowerName.includes('color') || lowerName.includes('colour')) {
    return COLOR_SUGGESTIONS;
  }
  if (lowerName.includes('size')) {
    return SIZE_SUGGESTIONS;
  }
  if (lowerName.includes('material') || lowerName.includes('fabric')) {
    return MATERIAL_SUGGESTIONS;
  }
  if (lowerName.includes('style') || lowerName.includes('fit')) {
    return STYLE_SUGGESTIONS;
  }
  
  return [];
};

// Function to auto-categorize based on tags
export const autoCategorizeTags = (tags: string[]): { categories: string[], collections: string[] } => {
  const foundCategories: string[] = [];
  const foundCollections: string[] = [];
  
  const lowerTags = tags.map(tag => tag.toLowerCase());
  
  // Check categories
  Object.entries(AUTO_CATEGORIZATION_RULES.categories).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerTags.some(tag => tag.includes(keyword)))) {
      foundCategories.push(category);
    }
  });
  
  // Check collections
  Object.entries(AUTO_CATEGORIZATION_RULES.collections).forEach(([collection, keywords]) => {
    if (keywords.some(keyword => lowerTags.some(tag => tag.includes(keyword)))) {
      foundCollections.push(collection);
    }
  });
  
  return { categories: foundCategories, collections: foundCollections };
};
