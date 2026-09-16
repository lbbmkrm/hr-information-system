import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import type {Employee} from "../types/employee.ts";
import {getEmployeesById, updateEmployee} from "../api/employeeApi.ts";
import {getUserById} from "../api/userApi.ts";
import type {User} from "../types/user.ts";
import UserSearchSelect from "../components/UserSearchSelect.tsx";
import {jwtDecode} from "jwt-decode";
import type {jwtPayload} from "../api/authApi.ts";

interface FormData {
    name: string;
    position: string;
    department: string;
    joinDate: string;
    phone? : string | null;
    userId? : string | null;
}

export default function EmployeeEdit() {
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        position: "",
        department: "",
        joinDate: "",
        phone: "",
        userId: ""
    });
    const [employeeUser, setEmployeeUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token");
    const currentUser = token ? jwtDecode<jwtPayload>(token) : null;


    const fetchDataUser = async (userId: string) => {
        try{
            setLoading(true);
            const user = await getUserById(userId);
            setEmployeeUser(user);
        }catch(e){
            console.error(e);
            setError("gagal mengambil data user");
        }finally {
            setLoading(false);
        }
    }

    const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        try{
            e.preventDefault();
            await updateEmployee(id as string, formData);
            navigate(`/employees/${id}`, {state: {message : "success"}});
        }catch(e){
            console.error(e);
            setError("gagal meng-edit data");
        }
    }

    const handleChangeValueInput = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        try{
            const {name, value} = e.target;

            setFormData(prevData => ({...prevData, [name]: value}));
        }catch(e){
            console.error(e);
            setError("gagal mengubah data form");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                setLoading(true);
                const employee = await getEmployeesById(id as string);
                setEmployee(employee);
                if(employee.userId){
                    await fetchDataUser(employee.userId as string);
                }
                setFormData({
                    name: employee.name,
                    position: employee.position,
                    department: employee.department,
                    joinDate: employee.joinDate,
                    phone: employee.phone,
                    userId : employee.userId,
                })
            }catch(e){
                console.error(e);
                setError("gagal mengambil data");
            }finally {
                setLoading(false);
            }
        }
        void fetchData();
    },[id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    if(!employee) {
        return <div>No employee found</div>;
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input name={"name"} onChange={handleChangeValueInput} id={"name"} value={formData.name}/>
                </div>
                <div>
                    <label htmlFor="department">Departemen</label>
                    <input name={"department"} onChange={handleChangeValueInput} id={"department"} value={formData.department}/>
                </div>
                <div>
                    <label htmlFor="position">Posisi</label>
                    <input name={"position"} onChange={handleChangeValueInput} id={"position"} value={formData.position}/>
                </div>
                <div>
                    <label htmlFor="joinDate">Bergabung</label>
                    <input
                        name="joinDate"
                        id="joinDate"
                        type="date"
                        onChange={handleChangeValueInput}
                        value={formData.joinDate ? new Date(formData.joinDate).toISOString().split('T')[0] : ""}
                    />
                </div>
                <div>
                    <label htmlFor="phone">Telepon</label>
                    <input name={"phone"} onChange={handleChangeValueInput} id={"phone"} value={formData.phone || ""}/>
                </div>
                <div>
                    <label htmlFor="user">Akun</label>
                    {employee.userId ? (
                        <div className="border p-2 rounded bg-gray-50 text-gray-600">
                            {employeeUser?.email ?? "Memuat..."}
                        </div>
                    ) : currentUser?.role === "ADMIN" ? (
                        <UserSearchSelect
                            value={formData.userId}
                            onSelect={(userId) => setFormData((prev) => ({ ...prev, userId }))}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm italic">
                            Belum terhubung ke akun. Hubungi Admin untuk menghubungkan.
                        </p>
                    )}
                </div>
                <button type="submit">simpan</button>
            </form>
        </div>
    )
}