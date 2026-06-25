// src/users/pagesUserListPage.js

import { DataTable } from "@/shared"
import { UserColumns } from "../table/UserColumns";
import { users } from "../data/users";


export default function UserListPage(){

    return(
        <div className="p-6">
            <h1 className="text-x1 font-semibold mb-4">Listado de Usuarios</h1>

            <DataTable data={users} columns={UserColumns} />
        </div>
    )
}