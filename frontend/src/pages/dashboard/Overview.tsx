import { useState } from "react";
import { BarChart, Card, Header, PieChart, Sidebar } from "../../components";

const Overview = () => {
    const [hide, setHide] = useState(false);

    const handleClick = () => {
        setHide(!hide);
    }

    // Contoh data bulanan
    const monthData = [
        { chartItem: "Januari", value: 18000, color: "#A3BFE8" },
        { chartItem: "Februari", value: 31000, color: "#6EE7D3" },
        { chartItem: "Maret", value: 22500, color: "#000000" },
        { chartItem: "April", value: 31500, color: "#7DB9FF" },
        { chartItem: "Mei", value: 14000, color: "#BE9BEF" },
        { chartItem: "Juni", value: 27000, color: "#6FDB8B" },
        { chartItem: "Juli", value: 18000, color: "#A29BF7" },
        { chartItem: "Agustus", value: 31000, color: "#97E3D5" },
        { chartItem: "September", value: 22500, color: "#000000" },
        { chartItem: "Oktober", value: 35000, color: "#97BEFF" },
        { chartItem: "November", value: 14000, color: "#B0C8EE" },
        { chartItem: "Desember", value: 27000, color: "#92E8B4" },
    ];
    const categoryData = [
        { chartItem: "Makanan", value: 18000, color: "#A3BFE8" },
        { chartItem: "Minuman", value: 31000, color: "#6EE7D3" },
        { chartItem: "Snack", value: 22500, color: "#000000" },
        { chartItem: "Lainnya", value: 31500, color: "#7DB9FF" },
    ];
    const yearData = [
        { chartItem: "2026", value: 52.1, color: "#000000" },
        { chartItem: "2025", value: 22.8, color: "#93BFFF" },
        { chartItem: "2024", value: 13.9, color: "#86EFAC" },
        { chartItem: "2023", value: 11.2, color: "#B0C7EE" },
    ]

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} page={1} />

            <div className="w-full">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {/* Content */}
                <main className="px-7 py-5 space-y-5">
                    <div className="flex gap-4">
                        <Card title="Total Revenue" total="Rp25.032.000" percentage="+11.01%" />
                        <Card title="Total Revenue" total="Rp25.032.000" percentage="+11.01%" />
                        <Card title="Total Revenue" total="Rp25.032.000" percentage="+11.01%" />
                    </div>
                    <BarChart title="Traffic by Month" data={monthData} maxValue={35000} />
                    <div className="flex gap-5">
                        <BarChart title="Traffic by Category" data={categoryData} maxValue={35000} />
                        <PieChart
                            title="Traffic by Year"
                            data={yearData}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Overview;