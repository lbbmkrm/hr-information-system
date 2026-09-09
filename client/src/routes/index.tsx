import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.tsx";
import Layout from "../component/Layout.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import EmployeeList from "../pages/EmployeeList.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <Layout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/employees", element: <EmployeeList /> },
        ],
    },
]);

export default router;
