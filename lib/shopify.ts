// Stub file for Shopify integration - to be implemented
export async function getCollection(handle: string) {
  return {
    title: 'Collection',
    handle: handle,
    seo: { title: 'Collection' },
    updatedAt: new Date().toISOString()
  };
}

export async function getCollections() {
  return [
    {
      title: 'Sample Collection',
      handle: 'sample',
      path: '/collections/sample',
      updatedAt: new Date().toISOString()
    }
  ];
}

export async function getProducts(options: any) {
  return [
    {
      handle: 'sample-product',
      title: 'Sample Product',
      updatedAt: new Date().toISOString()
    }
  ];
}

export async function getPages() {
  return [
    {
      handle: 'sample-page',
      title: 'Sample Page',
      updatedAt: new Date().toISOString()
    }
  ];
}

export async function addToCart(lines: any[]) {
  return {
    id: 'cart-id',
    lines: lines.map((line: any) => ({
      id: 'line-id',
      merchandise: { id: line.merchandiseId },
      quantity: line.quantity
    }))
  };
}

export async function removeFromCart(lineIds: string[]) {
  return {
    id: 'cart-id',
    lines: []
  };
}

export async function updateCart(lines: any[]) {
  return {
    id: 'cart-id',
    lines: lines.map((line: any) => ({
      id: line.id,
      merchandise: { id: line.merchandiseId },
      quantity: line.quantity
    }))
  };
}

export async function getCart() {
  return {
    id: 'cart-id',
    lines: [{
      id: 'line-id',
      merchandise: { id: 'merchandise-id' },
      quantity: 1
    }],
    checkoutUrl: 'https://example.com/checkout'
  };
}

export async function createCart() {
  return {
    id: 'cart-id',
    lines: [],
    checkoutUrl: 'https://example.com/checkout'
  };
}