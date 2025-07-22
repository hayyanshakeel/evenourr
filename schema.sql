-- schema.sql  (Turso / SQLite, works with Drizzle)

-- 1️⃣  Products
CREATE TABLE IF NOT EXISTS products (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL,           -- cents
  compare_price INTEGER,
  inventory     INTEGER DEFAULT 0,
  published     INTEGER DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣  Product variants
CREATE TABLE IF NOT EXISTS product_variants (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  sku         TEXT,
  price       INTEGER,                -- NULL = inherit product price
  inventory   INTEGER DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_product_title
  ON product_variants(product_id, title);

-- 3️⃣  Product images
CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT,
  position   INTEGER DEFAULT 0
);

-- 4️⃣  Collections / categories
CREATE TABLE IF NOT EXISTS collections (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT
);

CREATE TABLE IF NOT EXISTS product_collections (
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- 5️⃣  Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  code       TEXT UNIQUE NOT NULL,
  type       TEXT CHECK(type IN ('fixed','percent')) NOT NULL,
  value      INTEGER NOT NULL,   -- cents OR percent
  min_cart   INTEGER DEFAULT 0,
  max_uses   INTEGER DEFAULT 1,
  uses       INTEGER DEFAULT 0,
  starts_at  DATETIME,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6️⃣  Users
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT,                -- hashed
  first_name TEXT,
  last_name  TEXT,
  role       TEXT CHECK(role IN ('customer','admin')) DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7️⃣  Orders
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,
  total       INTEGER NOT NULL,   -- cents
  status      TEXT CHECK(status IN ('pending','paid','shipped','cancelled')) DEFAULT 'pending',
  coupon_id   INTEGER REFERENCES coupons(id) ON DELETE SET NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id INTEGER REFERENCES product_variants(id),
  quantity   INTEGER NOT NULL,
  price      INTEGER NOT NULL   -- unit price at time of order
);

-- 8️⃣  Carts
CREATE TABLE IF NOT EXISTS carts (
  id         TEXT PRIMARY KEY,          -- uuid / session id
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9️⃣  Cart items  (FIXED: no expression in PK)
CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id    TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id INTEGER REFERENCES product_variants(id),
  quantity   INTEGER CHECK(quantity > 0),
  UNIQUE(cart_id, product_id, variant_id)
);

-- 🔟  Menu items (header / footer)
CREATE TABLE IF NOT EXISTS menu_items (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  handle   TEXT NOT NULL,   -- 'main', 'footer' ...
  title    TEXT NOT NULL,
  path     TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

-- 1️⃣1️⃣  Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rating     INTEGER CHECK(rating BETWEEN 1 AND 5),
  title      TEXT,
  body       TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1️⃣2️⃣  Auto-update timestamp trigger
CREATE TRIGGER IF NOT EXISTS update_products_timestamp
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;