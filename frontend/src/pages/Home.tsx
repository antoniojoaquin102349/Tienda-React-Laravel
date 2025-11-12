import { Link } from "react-router";

const Home = () => {    
    return (    
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div>Welcome</div>
            <div>Zone 4x4 Store
                <Link to= "/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</Link>
                <Link to= "/register" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</Link>
                <Link to= "/dashboard" className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Dashboard</Link>
            </div>
        </div>  


    )
}
export default Home;