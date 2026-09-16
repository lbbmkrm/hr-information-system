import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.tsx";
import Layout from "../components/Layout.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import EmployeeList from "../pages/EmployeeList.tsx";
import EmployeeForm from "../pages/EmployeeForm.tsx";
import EmployeeDetail from "../pages/EmployeeDetail.tsx";
import EmployeeEdit from "../pages/EmployeeEdit.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <Layout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            {path: "/employees", children: [

                    { index: true, element: <EmployeeList /> },
                    {path: "new", element: <EmployeeForm/>},
                    {path: ":id", element: <EmployeeDetail/>},
                    {path: "edit/:id", element: <EmployeeEdit/>}
                ]},

        ],
    },
]);

export default router;
