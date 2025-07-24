# API Routes Documentation

## Products
- **GET** `/api/products`  
  Fetch all products. Query params: `status`, `limit`, `offset`.
- **POST** `/api/products`  
  Create a new product. Body: `name`, `price`, `inventory`, `status`, `image` (file).
- **PUT** `/api/products/[id]`  
  Update a product by ID. Body: any updatable product fields.
- **DELETE** `/api/products/[id]`  
  Delete a product by ID.
- **POST** `/api/products/batch`  
  Fetch details for multiple products by an array of IDs. Body: `ids` (array).

## Collections
- **GET** `/api/collections`  
  Fetch all collections.
- **POST** `/api/collections`  
  Create a new collection. Body: `title`, `handle`, `description`, `imageUrl`.

## Customers
- **GET** `/api/customers`  
  Fetch all customers.
- **GET** `/api/customers/[id]`  
  Fetch a single customer by ID, including addresses and recent orders.
- **PATCH** `/api/customers/[id]`  
  Update a customer by ID. Body: updatable customer fields.
- **DELETE** `/api/customers/[id]`  
  Delete a customer by ID (only if they have no orders).

## Orders
- **GET** `/api/orders`  
  Fetch all orders, including customer info.
- **GET** `/api/orders/[id]`  
  Fetch a single order by ID, including items.
- **PATCH** `/api/orders/[id]`  
  Update an order by ID. Body: updatable order fields.
- **DELETE** `/api/orders/[id]`  
  Delete an order by ID.

## Coupons
- **GET** `/api/coupons`  
  Fetch all coupons or a single coupon by code. Query param: `code`.
- **GET** `/api/coupons/[code]`  
  Fetch a single coupon by code.
- **DELETE** `/api/coupons/[code]`  
  Delete a coupon by code.

## Cart
- **GET** `/api/cart`  
  Fetch the current user's cart (requires Firebase authentication).
- **POST** `/api/cart`  
  Add an item to the cart or update quantity. Body: `productId`, `quantity`.
- **PATCH** `/api/cart/[itemId]`  
  Update the quantity of a cart item. Body: `quantity`.
- **DELETE** `/api/cart/[itemId]`  
  Remove an item from the cart.

## Dashboard Stats
- **GET** `/api/dashboard/stats`  
  Fetch dashboard statistics: total revenue, total sales, total customers, and recent orders. 