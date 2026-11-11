import { Link } from "react-router-dom";

const Sidebar = ({ hide, page }: { hide: boolean; page: number }) => {
    return(
        <nav className={`p-4 flex flex-col gap-3 w-56 h-dvh border-r border-gray-300 sticky top-0  ${hide ? "-ml-56" : "ml-0"} transition-all`}>
            <div className="p-2">
                <h2 className="text-blue-600">Iris</h2>
            </div>
            <div className="flex flex-col gap-1 p-2 h-full">
                <Link className={`w-full inline-block p-2 rounded-lg ${page === 1 ? "bg-blue-100 text-blue-600" : ""}`} to={'/'}>Overview</Link>
                <Link className={`w-full inline-block p-2 rounded-lg ${page === 2 ? "bg-blue-100 text-blue-600" : ""}`} to={'/products'}>Products</Link>
                <Link className={`w-full inline-block p-2 rounded-lg ${page === 3 ? "bg-blue-100 text-blue-600" : ""}`} to={'/orders'}>Orders</Link>
                <Link className={`w-full inline-block p-2 rounded-lg ${page === 4 ? "bg-blue-100 text-blue-600" : ""}`} to={'/iris-ai'}>Iris AI</Link>
            </div>
            <Link className="w-full inline-block p-2 rounded-lg text-red-600" to={'/'}>Sign Out</Link>
        </nav>
    )
}

export default Sidebar;