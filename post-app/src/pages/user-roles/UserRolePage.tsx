import { Button } from "@/components/ui/Button";
import {
  userRoleService,
  type UsersRoleInfo,
} from "@/services/UserRoleService";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UserRolePage = () => {
  const [userRoles, setUserRoles] = useState<UsersRoleInfo[]>([]);
  const rolesService = userRoleService;

  useEffect(() => {
    rolesService.getAllUserRoles().then(setUserRoles).catch(console.error);
  }, []);

  const handleChangeRole = async (userRole: UsersRoleInfo) => {
    const newRole = userRole.role === "admin" ? "user" : "admin";
    toast.promise(rolesService.changeUserRole(userRole.id, newRole), {
      success: () => {
        setUserRoles((prevUserRoles) =>
          prevUserRoles.map((role) =>
            role.id === userRole.id ? { ...role, role: newRole } : role
          )
        );
        return "Role changed successfully";
      },
      error: "Error changing role",
      loading: "Changing role...",
    });
    //    await ;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-4">User Roles</h2>
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center justify-between">
          <p className="font-bold">Email</p>
          <p className="font-bold">Role</p>
          <p className="font-bold">Change Role</p>
        </div>
        {userRoles.map((userRole) => (
          <div
            key={userRole.id}
            className="flex items-center justify-between bg-white/10 py-2 px-4 rounded-2xl"
          >
            <p>{userRole.email}</p>
            <p>{userRole.role}</p>
            <Button size={"sm"} onClick={() => handleChangeRole(userRole)}>
              {userRole.role === "admin" ? "Make User" : "Make Admin"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRolePage;
