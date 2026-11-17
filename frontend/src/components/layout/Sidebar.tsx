import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';

const Sidebar = ({ hide, page }: { hide: boolean; page: number }) => {
    return(
        <nav className={`p-4 flex flex-col gap-3 w-56 h-dvh border-r border-gray-300 sticky top-0 font-semibold ${hide ? "-ml-56" : "ml-0"} transition-all`}>
            <div className="p-2 flex items-center gap-2">
                <img src="/logo.png" alt="Logo Aplikasi" className="w-7 h-7" />
                <h2 className="text-blue-600">Iris</h2>
            </div>
            <div className="flex flex-col gap-1 p-2 h-full">
                <Link className={`w-full flex items-center gap-2 p-2 rounded-lg ${page === 1 ? "bg-blue-100 text-blue-600" : ""}`} to={'/'}><Icon className="text-xl" icon="boxicons:grid-column-left" /> Overview</Link>
                <Link className={`w-full flex items-center gap-2 p-2 rounded-lg ${page === 2 ? "bg-blue-100 text-blue-600" : ""}`} to={'/products'}><Icon className="text-xl" icon="akar-icons:shipping-box-01" /> Products</Link>
                <Link className={`w-full flex items-center gap-2 p-2 rounded-lg ${page === 3 ? "bg-blue-100 text-blue-600" : ""}`} to={'/orders'}><Icon className="text-xl" icon="icon-park-outline:transaction-order" /> Orders</Link>
                <Link className={`w-full flex items-center gap-2 p-2 rounded-lg ${page === 4 ? "bg-blue-100 text-blue-600" : ""}`} to={'/iris-ai'}><Icon className="text-xl" icon="mage:robot-happy" /> Iris AI</Link>
            </div>
            <Link className="w-full flex items-center gap-2 p-2 rounded-lg text-red-600" to={'/'}><Icon className="text-xl" icon="boxicons:arrow-out-left-square-half-filled" /> Sign Out</Link>
        </nav>
    )
}

export default Sidebar;