# ShopEase - Modern Full-Stack E-Commerce Platform

A production-grade, full-stack E-Commerce web application developed for college full-stack web development coursework. ShopEase provides an end-to-end shopping experience featuring secure user authentication, role-based access control (Admin & Customer), a dynamic product catalog, real-time shopping cart calculations, simulated checkout, order tracking, and a comprehensive administrative management dashboard.

---

## 🚀 Key Features

### Customer Experience
- **Product Catalog**: Filter by category (Audio, Workspace, Wearables, Accessories), live keyword search, and sorting (price low-to-high, high-to-low, newest arrivals, stock levels).
- **Product Details Page (PDP)**: Contiguous purchase module with high-resolution imagery, stock availability status, quantity steppers, and feature specifications.
- **Cart Management**: Add products to cart, increment/decrement quantities with automatic stock validation, remove items, clear cart, dynamic subtotal and shipping fee calculation (free shipping over $100).
- **Checkout & Shipping**: Customer contact information, complete street address with city, state, and pincode, simulated payment checkout, and immediate order placement.
- **Order Tracking**: Real-time status progression (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` or `Cancelled`) with order receipts and timestamp history.
- **User Authentication**: Secure registration and login with bcrypt password hashing and 30-day JWT tokens. Includes instant one-click demo credentials for assignment grading.
- **Profile Management**: View account role, update personal name, update email, and change passwords.

### Administrator Capabilities
- **Role-Based Access Control (RBAC)**: All administrative endpoints and views are protected with JWT verification and admin role enforcement.
- **Executive Dashboard**: Real-time business metrics including Total Sales, Total Orders, Total Products in catalog, and Total Registered Users.
- **Product Inventory Management (CRUD)**:
  - Add new products (name, description, price, category, image URL, stock count).
  - Edit existing product specifications, pricing, and stock.
  - Delete products with safe confirmation dialogs.
- **Order Fulfillment**:
  - View all customer orders across the platform.
  - Update order delivery status in real-time.
  - Inspect individual customer delivery manifests and contact details.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite 8 (TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Architecture**: Context API (`AuthContext`, `CartContext`, `ToastContext`), modular components, zero-pill metadata typography

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (includes an automatic embedded persistent store fallback for instant zero-config sandbox execution)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security**: CORS enabled, input validation, role-based access middleware

---

## 📂 Project Structure

```text
ecommerce-web-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & initial seeds
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── productController.js  # Product catalog & CRUD operations
│   │   ├── orderController.js    # Order creation, listing, status updates
│   │   └── userController.js     # User management & admin stats
│   ├── middleware/
│   │   └── auth.js               # JWT verification & admin check
│   ├── models/
│   │   ├── User.js               # Mongoose User schema
│   │   ├── Product.js            # Mongoose Product schema
│   │   └── Order.js              # Mongoose Order schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── productRoutes.js      # /api/products routes
│   │   ├── orderRoutes.js        # /api/orders routes
│   │   └── userRoutes.js         # /api/users routes
│   ├── services/
│   │   └── dbManager.js          # Unified DB & fallback persistence engine
│   ├── server.js                 # Standalone Express backend server
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, LoadingSpinner
│   │   ├── context/              # AuthContext, CartContext, ToastContext
│   │   ├── pages/                # 12 application pages
│   │   ├── services/             # REST API service client
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── App.css               # Global styling
│   │   ├── App.jsx               # Application root component
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html                # HTML entry point
│   └── package.json              # Frontend dependencies
├── src/                          # Integrated full-stack workspace source
├── server.ts                     # Unified dev & production server
├── .env.example                  # Root environment variables template
├── .gitignore                    # Git ignore file
└── README.md                     # Documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (or in `backend/.env`) with the following keys:

```bash
# MongoDB connection URI (local MongoDB daemon or MongoDB Atlas cloud cluster)
MONGODB_URI="mongodb://localhost:27017/shopease"

# JWT Secret for token signing
JWT_SECRET="your_secure_jwt_secret_key_change_in_production"

# Server Port
PORT=3000
```

> **Note on Sandbox Execution:** If `MONGODB_URI` is not reachable (e.g. running in an isolated container without a local MongoDB service), ShopEase automatically initializes a persistent JSON database in `.data/db.json` with pre-seeded products, users, and orders, guaranteeing 100% functionality out of the box!

---

## 📥 Installation & Running

### Option 1: Unified Full-Stack Run (Recommended)

Run both Express REST API and React Vite frontend concurrently through `server.ts`:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

### Option 2: Running Separate Backend & Frontend

#### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev     # Starts server on port 5000 (or configured PORT)
```

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server on port 5173
```

---

## 🔑 Pre-Configured Demo Accounts

For immediate evaluation and testing, you can use the one-click demo buttons on the Login page or use the credentials below:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@shopease.com` | `admin123` | Full access to Product CRUD, Order Statuses, and Analytics |
| **Customer** | `user@shopease.com` | `user123` | Browsing, Cart, Checkout, Order Tracking, and Profile |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, optional `role`).
- `POST /api/auth/login` — Sign in with `email` and `password`, returns JWT.
- `GET /api/auth/profile` — Get authenticated user's profile (requires `Bearer` token).

### Products (`/api/products`)
- `GET /api/products` — Retrieve all products (supports `?category=` and `?search=`).
- `GET /api/products/:id` — Retrieve a single product by ID.
- `POST /api/products` — Create a product (*Admin only*).
- `PUT /api/products/:id` — Update a product (*Admin only*).
- `DELETE /api/products/:id` — Delete a product (*Admin only*).

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order with products, total, and shipping address (*Protected*).
- `GET /api/orders` — List user's orders, or all orders if requested by Admin (*Protected*).
- `GET /api/orders/:id` — Get single order details (*Protected*).
- `PUT /api/orders/:id/status` — Update order delivery status (*Admin only*).

### User & Administration (`/api/users`)
- `GET /api/users/profile` — Get user profile (*Protected*).
- `PUT /api/users/profile` — Update user profile details (*Protected*).
- `GET /api/users/admin/stats` — Retrieve aggregated dashboard stats (*Admin only*).

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords are salt-hashed using `bcryptjs` with 10 salt rounds before storage.
- **JWT Authorization**: Requests to private endpoints require standard HTTP `Authorization: Bearer <token>` headers.
- **Strict Role Verification**: Endpoints requiring admin privileges enforce role validation at the middleware layer.
- **Stock Validation**: Inventory is checked and decremented atomically on checkout; requests exceeding available stock are rejected.
- **Clean Configuration**: Sensitive secrets are loaded through environment variables, preventing hardcoded credentials from leaking into Git.

---

## 🚀 Deployment Instructions

### Deploy to Render / Railway / Heroku
1. Push codebase to your GitHub repository.
2. In your cloud provider dashboard, create a new Web Service pointing to the repository.
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm start`
5. Configure Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.

---

## 🔮 Future Enhancements
- Integration with real payment gateways (Stripe, Razorpay).
- Email notifications for order confirmations using Nodemailer or SendGrid.
- Customer product reviews and 5-star ratings.
- Wishlist and save-for-later functionality.
