import type { User } from "../types/user.types"

interface Props {
  users: User[];
}

function UsersTable({ users }: Props){
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-muted bg-surface shadow-sm">
      <table className="w-full text-sm text-left border-collapse">

        <thead className="bg-input-bg text-text-muted border-b border-border-strong uppercase tracking-wider text-xs">
          <tr>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">Role</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-muted text-text-main">
          {users.map((u)=>(
            <tr key={u._id}>

              <td className="p-4 font-semibold text-text-main">
                {u.name}
              </td>

              <td className="p-4 text-text-muted">
                {u.email}
              </td>

              <td className="p-4">
                <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                  u.role === "admin" 
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                  {u.role.toUpperCase()}
                </span>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default UsersTable