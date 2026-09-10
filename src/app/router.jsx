// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { UserListPage, UserRegisterForm, UserDetailPage, UserEditPage } from "@/features/users";
import { DishForm, DishListPage, DishViewPage, DishEditPage } from "@/features/dishes";
import { ProviderCreateForm, ProviderListPage, ProviderDetailPage, ProviderEditPage } from "@/features/providers";
import { InventoryForm, InventoryListPage, InventoryUltimosPasos } from "@/features/inventory";
import { OrderForm } from "@/features/orders";
import HomePage from "@/features/home/pages/HomePage";
import MenuPage from "@/features/menu/pages/MenuPage";
import LoginForm from "@/features/users/components/LoginForm";
import { PermissionPage } from "@/features/permissions";
import ViewMenuPage from "@/features/menu/pages/ViewMenuPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/home" replace />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <UserRegisterForm />, 
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
      { path: "menu/view/:id", element: <ViewMenuPage /> },


      { path: "userList", element: <UserListPage /> },
      { path: "userCreate", element: <UserRegisterForm /> },
      { path: "userview/:id", element: <UserDetailPage /> },
      { path: "userEdit/:id", element: <UserEditPage /> },

      { path: "providerList", element: <ProviderListPage /> },
      { path: "providerCreate", element: <ProviderCreateForm /> },
      { path: "providerView/:id", element: <ProviderDetailPage /> },
      { path: "providerEdit/:id", element: <ProviderEditPage /> },

      { path: "dishCreate", element: <DishForm /> },
      { path: "dishList", element: <DishListPage /> },
      { path: "dishes/:id/view", element: <DishViewPage /> },
      { path: "dishes/:id/edit", element: <DishEditPage /> },

      { path: "createInventory", element: <InventoryForm /> },
      { path: "createInventorySteps", element: <InventoryUltimosPasos /> },
      { path: "inventoryList", element: <InventoryListPage /> },

      { path: "permissions", element: <PermissionPage /> },

      { path: "OrderForm", element: <OrderForm /> },
    ],
  },
]);

export default router;