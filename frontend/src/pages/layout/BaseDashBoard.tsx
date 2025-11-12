import { Outlet } from "react-router";

const BaseDashBoard = () => {   
    return (
        <div>
            <h1>BaseDashBoard</h1>
            <Outlet />
        </div>
    )
}
export default BaseDashBoard;