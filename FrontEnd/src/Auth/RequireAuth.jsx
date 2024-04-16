import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({allowerRoles}){
    const {isLoggedIn , role} = useSelector((state)=>state?.auth);

    return isLoggedIn && allowerRoles.find((myRole)=>myRole==role)?(
        <Outlet />
    ):isLoggedIn?<Navigate to='/denied' />:<Navigate to='/login' />
}

export default RequireAuth;