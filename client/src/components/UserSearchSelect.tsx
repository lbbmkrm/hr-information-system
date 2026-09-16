import {useEffect, useState} from "react";
import type {User} from "../types/user.ts";
import {getUsers} from "../api/userApi.ts";

interface UserSearchSelectProps {
    value: string | null | undefined;
    onSelect: (userId: string, email: string) => void;
    currentEmail?: string | null ;
}

export default function UserSearchSelect({value, onSelect, currentEmail}: UserSearchSelectProps) {
    const [avaibleUsers, setAvaibleUsers] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAvaible = async () => {
            try{
                setLoading(true);
                const unConnectedUsers = await getUsers({assigned: false});
                setAvaibleUsers(unConnectedUsers as User[]);
            }catch (error) {
                console.log(error);
            }finally {
                setLoading(false);
            }
        }
        void fetchAvaible();
    }, [])

    const filtered = avaibleUsers.filter((user) => {
        return user.email.toLowerCase().includes(searchValue.toLowerCase());
    })

    if(value && currentEmail){
        return (
            <div className={"border p-2 bg-gray-50 text-gray-600"}>
                {currentEmail} <span className={"text-xs"}>(sudah terhubung)</span>
            </div>
        )
    }

    return (
        <div className={"relative"}>
            <input type={"text"} placeholder={loading ? "Memuat users" : "cari email user"}
            value={searchValue}
            disabled={loading}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            className={"w-full border p-2 rounded"} />

            {isOpen && filtered.length > 0 && (
                <ul className={"absolute z-10 w-full bg-white border rounded mt-1 max-h-48 overflow-y-auto shadow"}>
                    {filtered.map((user) => (
                        <li key={user.id}
                        onMouseDown={() => {
                            onSelect(user.id, user.email);
                            setSearchValue(user.email);
                            setIsOpen(false);
                        }}
                        className={"p-2 hover:bg-gray-50 cursor-pointer"}>
                            {user.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

