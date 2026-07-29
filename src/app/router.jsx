// src/app/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, DashboardLayout } from '@/shared';
import { UserListPage, UserRegisterForm } from "@/features/users";
import { DishForm, DishListPage } from "@/features/dishes";
import { ProviderCreateForm } from "@/features/providers";
import { InventoryForm, InventoryListPage } from "@/features/inventory";
import { OrderForm } from "@/features/orders";
import { ProviderListPage } from "@/features/providers";



const router = createBrowserRouter([
{
    path: '/',
    element: <Navigate to="/dashboard" replace />,
},
{
    path: "/auth",
    element: <AuthLayout />,
    children: [
        {
            index:true,
        },
    ],
},
{
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
        { index: true,},
        // { path: "/dashboard/auth", element: <h1>Hello2</h1>},
        { path: "/dashboard/userList", element: <UserListPage />},
        { path: "/dashboard/userCreate", element: <UserRegisterForm />},

        { path: "/dashboard/dishCreate", element: <DishForm /> },     
        { path: "/dashboard/dishList", element: <DishListPage /> },     
        
        { path: "/dashboard/providerCreate", element: <ProviderCreateForm /> },     
        { path: "/dashboard/providerList", element: <ProviderListPage /> },

        { path: "/dashboard/createInventory", element: <InventoryForm /> },        
        { path: "/dashboard/inventoryList", element: <InventoryListPage /> },        
        { path: "/dashboard/OrderForm", element: <OrderForm /> },


        ],
    },
]);

export default router;

