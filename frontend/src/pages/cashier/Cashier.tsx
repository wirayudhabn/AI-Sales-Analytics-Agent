import { Icon } from "@iconify/react";
import { SidebarCashier } from "../../components";

const Cashier = () => {
    return (
        <div className="flex min-h-dvh">
            {/* Sidebar */}
            <SidebarCashier page={1} />

            {/* Menu */}
            <main className="px-7 py-5 space-y-5 w-full">
                {/* Search Bar */}
                <div className="bg-gray-300/30 flex items-center gap-2 rounded-lg">
                    <Icon
                        icon="lucide:search"
                        className="text-gray-500 ml-3"
                        width={16}
                        height={16}
                    />
    
                    <input
                        type="search"
                        placeholder="Search"
                        className="py-2 pr-3 text-sm outline-none"
                    />
                </div>
                <p>Cashier</p>
            </main>

            <div className="bg-gray-300 w-0.5 self-stretch"></div>

            {/* Detail */}
            <div className="w-1/2">
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-300">
                    <div>
                        <p className="text-2xl font-semibold">Detail Pesanan</p>
                        <p className="font-medium text-gray-600">4 item terpilih</p>
                    </div>
                    <button className="text-red-600 flex gap-2 items-center"><Icon className="text-xl" icon="ant-design:clear-outlined" /> Clear</button>
                </div>
                <div className="px-7 py-5">
                    <div className="px-4 py-2 rounded-lg border border-gray-300">
                        <p className="text-lg font-semibold">Iced Tea</p>
                        <p className="text-gray-600">Rp18.000</p>
                        <div className="flex items-center rounded-sm border border-gray-300 w-fit">
                            <button className="cursor-pointer px-3 py-1">-</button>
                            <p>1</p>
                            <button className="cursor-pointer px-3 py-1">+</button>
                        </div>
                        <p className="text-lg font-semibold">Rp36.000</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cashier;