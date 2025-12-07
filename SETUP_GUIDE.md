# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB (optional - defaults to mongodb://localhost:27017/naturewear)
MONGODB_URI=mongodb://localhost:27017/naturewear

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features Implemented

### 1. Product CRUD in Admin Dashboard
- **Location**: `/admin/products`
- **Features**:
  - Create new products
  - Edit existing products
  - Delete products
  - View all products with images
  - Toggle product active/inactive status
  - Manage stock levels

### 2. Admin Dashboard
- **Location**: `/admin`
- **Features**:
  - Real-time statistics (Users, Orders, Revenue)
  - Left sidebar navigation
  - Settings page for managing policies
  - Products management page

### 3. Stripe Payment Integration
- **Checkout Flow**:
  1. Add products to cart
  2. Go to cart page
  3. Click "Proceed to Checkout"
  4. Redirected to Stripe checkout
  5. Complete payment
  6. Redirected back to cart with success message

### 4. Product Management
- Products are stored in MongoDB
- Products page (`/products`) fetches from database
- Cart uses localStorage (can be upgraded to database)
- Stock management
- Active/Inactive product status

## Making a User Admin

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users** section
3. Find your user account
4. Click on the user to open details
5. Go to the **Metadata** tab
6. Under **Public metadata**, add:
   ```json
   {
     "role": "admin"
   }
   ```
7. Save the changes
8. Refresh your application

## Middleware Fix

The middleware (`proxy.ts`) has been fixed to properly check admin role using `publicMetadata` from Clerk session claims. The redirect issue should now be resolved.

## Testing Stripe

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any CVC

## Next Steps

1. Make sure MongoDB is running
2. Set up Clerk authentication
3. Add Stripe keys
4. Make yourself admin via Clerk Dashboard
5. Start adding products from `/admin/products`

