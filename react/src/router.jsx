import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./view/Login";
import Signup from "./view/Signup";
import Users from "./view/Users";
import Dashboard from "./view/Dashboard";
import NotFound from "./view/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import VerificationSuccess from "./components/VerificationSuccess";
import VerificationFailed from "./components/VerificationFailed";
import EmailVerificationPending from "./components/EmailVerificationPending";
import UserForm from "./view/UserForm";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to='/users' />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/users/new',
                element: <UserForm key='userCreate' />
            },
            {
                path: '/users/:id',
                element: <UserForm key='userUpdate' />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },
    {
        path: '/email-verification-pending',
        element: <EmailVerificationPending />
    },
    {
        path: '/verification-success',
        element: <VerificationSuccess />
    },
    {
        path: '/verification-failed',
        element: <VerificationFailed />
    },
    {
        path: '*',
        element: <NotFound />
    },
]);

export default router;