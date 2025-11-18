import type { RootState } from "../store"; // Adjust the path to where your store is defined
import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

type Props = {
    children: ReactNode | ReactNode[]
}

const ProtectedRoute = ({children}: Props) =>{
    const {islogin} = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()

    useEffect(()=>{
        if (!islogin) {
        navigate('/login')
        }
    }, [islogin])

    return <div>{children}</div>;
    
}

export default ProtectedRoute