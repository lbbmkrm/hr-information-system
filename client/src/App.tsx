import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import EmployeeProvider from "./contexts/EmployeeProvider.tsx";
function App() {
    return (
        <>
            <AuthProvider>
                <EmployeeProvider>
                    <RouterProvider router={router} />
                </EmployeeProvider>
            </AuthProvider>
        </>
    );
}

export default App;
