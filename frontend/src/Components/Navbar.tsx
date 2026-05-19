import { useState } from "react"
import { NavLink , useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { JSX } from "react"
import { LogOut, Menu , X } from "lucide-react"

function Navbar(): JSX.Element {
  const { user,logout } = useAuth()
  const navigate= useNavigate()
  
  const [isOpen , setIsOpen ] = useState<boolean>(false)

  const handleLogout =(): void => {
    logout()
    navigate("/")
    setIsOpen( false) 
  }

  const linkStyles =( { isActive }:{ isActive: boolean }) =>
    isActive
      ? "text-red-500 font-semibold block py-2 md:py-0"
      : "text-text-muted hover:text-text-main block py-2 md:py-0"

  return (
    <nav className="border-b border-border-muted bg-surface px-6 py-4 relative z-50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-text-main">Smart Leads</h1>

          <div className="hidden md:flex items-center gap-4 text-lg">
            <NavLink to="/dashboard" className={ linkStyles }>
              Dashboard
            </NavLink>
            <NavLink to="/leads" className={linkStyles}>
              Leads
            </NavLink>
            { user?.role=== "admin" && (
              <NavLink to="/users" className={ linkStyles}>
                Users
              </NavLink>
            ) }
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user?.role &&(
            <div className="text-lg text-text-muted">
              { user.role.toUpperCase() }
            </div>
          ) }

          <button
            onClick={handleLogout }
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-600 active:scale-[0.98] transition-all cursor-pointer"
          >
            <LogOut size={ 16 } />
            Logout
          </button>
        </div>

        <div className="flex md:hidden">
          <button
            onClick={ ()=> setIsOpen(!isOpen) }
            className="text-text-muted hover:text-text-main focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={ 24 } />: <Menu size={24 } />}
          </button>
        </div>
      </div>

      { isOpen &&(
        <div className="absolute top-full left-0 w-full bg-surface border-b border-border-muted px-6 py-4 flex flex-col gap-4 shadow-lg md:hidden z-50">
          <div className="flex flex-col text-lg border-b pb-3 border-border-muted">
            <NavLink to="/dashboard" className={linkStyles } onClick={ ()=>setIsOpen(false) }>
              Dashboard
            </NavLink>
            <NavLink to="/leads" className={ linkStyles} onClick={ () =>setIsOpen(false) }>
              Leads
            </NavLink>
            { user?.role === "admin"&&(
              <NavLink to="/users" className={linkStyles} onClick={ ()=> setIsOpen(false) }>
                Users
              </NavLink>
            )}
          </div>

          <div className="flex flex-col gap-3">
            { user?.role && (
              <div className="text-center text-md text-text-muted w-full">
                {user.role.toUpperCase()}
              </div>
            ) }

            <button
              onClick={ handleLogout}
              className="flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-rose-600 active:scale-[0.98] transition-all w-full cursor-pointer"
            >
              <LogOut size={16 } />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar