import { SidebarCashier } from "../../components";

const Cashier = () => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <SidebarCashier page={1} />

            {/* Content */}
            <main className="px-7 py-5 space-y-5">
                <p>Cashier</p>
            </main>
        </div>
    )
}

export default Cashier;