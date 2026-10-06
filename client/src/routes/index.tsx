import {createBrowserRouter, Navigate} from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage.tsx";
import Layout from "../components/Layout.tsx";
import DashboardPage from "../pages/dashboard/DashboardPage.tsx";
import ListEmployees from "../pages/employees/ListEmployees.tsx";
import CreateEmployee from "../pages/employees/CreateEmployee.tsx";
import ViewEmployee from "../pages/employees/ViewEmployee.tsx";
import EditEmployee from "../pages/employees/EditEmployee.tsx";
import ListLeaveRequests from "../pages/leave-requests/ListLeaveRequests.tsx";
import CreateLeaveRequest from "../pages/leave-requests/CreateLeaveRequest.tsx";
import ListMyLeaveRequests from "../pages/leave-requests/ListMyLeaveRequests.tsx";
import ViewLeaveRequest from "../pages/leave-requests/ViewLeaveRequest.tsx";
import ReviewLeaveRequest from "../pages/leave-requests/ReviewLeaveRequest.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import GuestRoute from "../components/GuestRoute.tsx";
import EditLeaveRequest from "../pages/leave-requests/EditLeaveRequest.tsx";
import ListUsers from "../pages/users/ListUsers.tsx";
import CreateUser from "../pages/users/CreateUser.tsx";
import ViewUser from "../pages/users/ViewUser.tsx";
import EditUser from "../pages/users/EditUser.tsx";

const router = createBrowserRouter([
    {
        element: <GuestRoute />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                      path: "/", element: <Navigate to={"/dashboard"} replace={true}/>
                    },
                    { path: "/dashboard", element: <DashboardPage /> },
                    {
                        path: "/users",
                        children: [
                            { index: true, element: <ListUsers /> },
                            { path: "add", element: <CreateUser /> },
                            { path: ":id", element: <ViewUser /> },
                            { path: "edit/:id", element: <EditUser /> },
                        ],
                    },
                    {
                        path: "/employees",
                        children: [
                            {
                                element: <ProtectedRoute />,
                                children: [
                                    { index: true, element: <ListEmployees /> },
                                    { path: "add", element: <CreateEmployee /> },
                                    { path: ":id", element: <ViewEmployee /> },
                                    { path: "edit/:id", element: <EditEmployee /> },
                                ],
                            },
                        ],
                    },
                    {
                        path: "/leave-requests",
                        children: [
                            { index: true, element: <ListLeaveRequests /> },
                            { path: "me", element: <ListMyLeaveRequests /> },
                            { path: "add", element: <CreateLeaveRequest /> },
                            { path: ":id", element: <ViewLeaveRequest /> },
                            { path: "edit/:id", element: <EditLeaveRequest /> },
                            {
                                path: "edit/:id/status",
                                element: <ReviewLeaveRequest />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default router;
