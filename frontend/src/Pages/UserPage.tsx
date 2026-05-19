import { useCallback, useEffect, useState } from "react"
import api from "../api/axios"
import UsersTable from "../Components/UserTable"
import Pagination from "../Components/Pagination"
import type { User } from "../types/user.types"
import type { UsersResponse } from "../types/user.types"

function UsersPage(){
  const [users,setUsers ]= useState<User[]>([])
  const [loading,setLoading]= useState<boolean>(false)
  const [page,setPage ]= useState<number>(1)
  const [totalPages,setTotalPages ]= useState<number>(1)
  const limit = 10;

  const fetchUsers= useCallback(async()=>{
    try{
      setLoading(true)
      const res = await api.get<UsersResponse>("/users",{
        params:{
          page,
          limit,
        },
      })

      setUsers(res.data.data)
      setTotalPages(res.data.pagination.pages)
    }catch(err ){
      console.error("Failed to fetch users",err )
    }finally{
      setLoading(false)
    }
  },[page])

  useEffect(()=>{
    fetchUsers()
  },[fetchUsers])

  return(
    <div className="p-6 bg-canvas min-h-screen text-text-main transition-colors duration-200 flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-text-main tracking-tight">Users</h1>

      {/* LOADING */}
      { loading && (
        <p className="text-text-muted text-sm font-medium p-4">Loading users...</p>
      )}

      {/* TABLE */}
      { !loading && (
        users.length === 0 ? (
          <div className="border border-border-strong bg-surface rounded-xl p-12 text-center text-text-muted text-sm font-medium">
            No users found.
          </div>
        ) : (
          <UsersTable users={users} />
        )
      )}

      {/* PAGINATION */}
      { !loading && users.length > 0 && (
        <div className="pt-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      )}

    </div>
  )
}

export default UsersPage