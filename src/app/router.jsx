// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { UserListPage, UserRegisterForm, UserDetailPage } from "@/features/users";
import { DishForm, DishListPage } from "@/features/dishes";
import { ProviderCreateForm, ProviderListPage, ProviderDetailPage } from "@/features/providers";
import { InventoryForm, InventoryListPage } from "@/features/inventory";
import { OrderForm } from "@/features/orders";
import HomePage from "@/features/home/pages/HomePage";
import MenuPage from "@/features/menu/pages/MenuPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/home" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true },
      { path: "home", element: <HomePage /> },
      { path: "menu", element: <MenuPage /> },


      { path: "userList", element: <UserListPage /> },
      { path: "userCreate", element: <UserRegisterForm /> },
      { path: "userview/:id", element: <UserDetailPage /> },

      { path: "providerList", element: <ProviderListPage /> },
      { path: "providerCreate", element: <ProviderCreateForm /> },
      { path: "providerView/:id", element: <ProviderDetailPage /> },

   
      { path: "dishCreate", element: <DishForm /> },
      { path: "dishList", element: <DishListPage /> },

      
      { path: "createInventory", element: <InventoryForm /> },
      { path: "inventoryList", element: <InventoryListPage /> },

      
      { path: "OrderForm", element: <OrderForm /> },
    ],
  },
]);

export default router;
