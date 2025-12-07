# Clerk Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with your Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

You can get these keys from your [Clerk Dashboard](https://dashboard.clerk.com).

## Making a User Admin

There are two ways to make a user an admin:

### Method 1: Using the Set Admin Page (Development)

1. Sign in to your account
2. Navigate to `/set-admin`
3. Click "Make Me Admin" button
4. The page will automatically refresh and you'll have admin access

### Method 2: Using Clerk Dashboard (Recommended for Production)

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
8. Refresh your application - you should now see the "Admin" link in the navigation

## Admin Features

Once you're an admin, you can:

- Access the admin dashboard at `/admin`
- View statistics and metrics
- Manage products, orders, and policies
- Access quick actions for common tasks

## Protected Routes

The `/admin` route is protected by middleware. Only users with `role: "admin"` in their public metadata can access it.

## Sign In / Sign Up

- Sign in page: `/sign-in`
- Sign up page: `/sign-up`
- Or use the modal buttons in the navigation

