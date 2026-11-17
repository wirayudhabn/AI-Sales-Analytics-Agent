import { SidebarCashier } from "../../components";

const History = () => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <SidebarCashier page={2} />

            {/* Content */}
            <main className="px-7 py-5 space-y-5">
                <p>History</p>
            </main>
        </div>
    )
}

export default History;