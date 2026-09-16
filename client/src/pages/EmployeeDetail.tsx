import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Employee} from "../types/employee.ts";
import {deleteEmployee, getEmployeesById} from "../api/employeeApi.ts";

export default function EmployeeDetail() {
    const {id} = useParams<{id: string}>();
    const [employee, setEmployee] = useState<Employee|null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try{
                setLoading(true);
                const data = await getEmployeesById(id as string);
                setEmployee(data)
            }catch(e){
                console.error(e);
                setError("gagal mengambil data employee")
            }finally{
                setLoading(false);
            }
        }
        void fetchData();
    },[id]);

    const handleDeleteEmployee = async (id: string) => {
        try{
            await deleteEmployee(id);

        }catch (e){
            console.error(e);
            setError("gagal menghapus data employee")
        }
    }

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>{error}</div>;
    }

    if(!employee){
        return <div>No employee found</div>;
    }

    return (
        <div className={"min-h-screen w-full flex justify-center items-center"}>
           <div className={"p-4 md:p-8 m-4 md:m-8 flex flex-col gap-8 justify-between"}>
               <div id={"profile"} className={""}>
                   <div>{employee?.name.charAt(0).toLocaleUpperCase()}</div>
               </div>
               <div id={"information"} className={""}>
                   <ul>
                       <li>{employee.name}</li>
                       <li>{employee.department}</li>
                       <li>{employee.position}</li>
                       <li>{new Date(employee.joinDate).toLocaleDateString("id-ID")}</li>
                   </ul>
               </div>
               <div className={"w-full flex justify-between"}>
                   <button className={"text-sky-600 hover:underline"}>
                       <Link to={`/employees/edit/${employee.id}`} state={employee.id}>edit</Link>
                   </button>
                   <button onClick={() => handleDeleteEmployee(employee.id)} className={"text-red-600 hover:underline"}><Link to={"/employees"}>hapus</Link></button>
               </div>
           </div>
        </div>
    )
}