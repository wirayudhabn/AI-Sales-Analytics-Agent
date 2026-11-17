import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';

const SidebarCashier = ({ page }: { page: number }) => {
    return(
        <nav className={`p-4 flex flex-col items-center gap-3 h-dvh border-r border-gray-300 sticky top-0 font-semibold`}>
            <div className="p-2">
                <img src="/logo.png" alt="Logo Aplikasi" className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1 p-2 h-full">
                <Link className={`w-full p-2 rounded-lg ${page === 1 ? "text-blue-600" : ""}`} to={'/cashier'}><Icon className="text-xl" icon="boxicons:grid-column-left" /></Link>
                <Link className={`w-full p-2 rounded-lg ${page === 2 ? "text-blue-600" : ""}`} to={'/history'}><Icon className="text-xl" icon="icon-park-outline:transaction-order" /></Link>
            </div>
            <Link className="w-full p-2 rounded-lg text-red-600" to={'/login'}><Icon className="text-xl" icon="boxicons:arrow-out-left-square-half-filled" /></Link>
        </nav>
    )
}

export default SidebarCashier;