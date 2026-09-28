import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login.tsx";
import Layout from "../components/Layout.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";
import EmployeeList from "../pages/employees/EmployeeList.tsx";
import EmployeeForm from "../pages/employees/EmployeeForm.tsx";
import EmployeeDetail from "../pages/employees/EmployeeDetail.tsx";
import EmployeeEdit from "../pages/employees/EmployeeEdit.tsx";
import LeaveRequestList from "../pages/leave-requests/LeaveRequestList.tsx";
import LeaveRequestForm from "../pages/leave-requests/LeaveRequestForm.tsx";
import MyLeaveRequest from "../pages/leave-requests/MyLeaveRequest.tsx";
import LeaveRequestDetail from "../pages/leave-requests/LeaveRequestDetail.tsx";
import LeaveRequestEditStatus from "../pages/leave-requests/LeaveRequestEditStatus.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <Layout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            {
                path: "/employees",
                children: [
                    { index: true, element: <EmployeeList /> },
                    { path: "add", element: <EmployeeForm /> },
                    { path: ":id", element: <EmployeeDetail /> },
                    { path: "edit/:id", element: <EmployeeEdit /> },
                ],
            },
            {
                path: "/leave-requests",
                children: [
                    { index: true, element: <LeaveRequestList /> },
                    { path: "me", element: <MyLeaveRequest /> },
                    { path: "add", element: <LeaveRequestForm /> },
                    { path: "edit/:id/status", element: <LeaveRequestEditStatus /> },
                    { path: ":id", element: <LeaveRequestDetail /> },
                ],
            },
        ],
    },
]);

export default router;
