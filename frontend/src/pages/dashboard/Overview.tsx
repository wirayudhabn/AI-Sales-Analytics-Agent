import { useState } from "react";
import { Icon } from "@iconify/react";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Header, Sidebar } from "../../components";

const STATS = [
    { title: "Total Revenue", value: "Rp2.539.000", growth: "+11.01%", note: "Bulan ini" },
    { title: "Products Sold", value: "12.543", growth: "+11.01%", note: "Bulan ini" },
    { title: "Additional Products", value: "80", growth: "+11.01%", note: "Bulan ini" },
];

const TRAFFIC_MONTH = [
    { name: "Januari", value: 18000, color: "#a1b9e8" },
    { name: "Februari", value: 31000, color: "#6ee7d0" },
    { name: "Maret", value: 22000, color: "#000000" },
    { name: "April", value: 31500, color: "#7bb8ff" },
    { name: "Mei", value: 13000, color: "#b79bec" },
    { name: "Juni", value: 26500, color: "#6dd68a" },
    { name: "Juli", value: 18000, color: "#a39bf0" },
    { name: "Agustus", value: 31000, color: "#96e3d3" },
    { name: "September", value: 22000, color: "#000000" },
    { name: "Oktober", value: 35000, color: "#8fbcff" },
    { name: "November", value: 13000, color: "#adc6ec" },
    { name: "Desember", value: 26500, color: "#8fe8b4" },
];

const TRAFFIC_CATEGORY = [
    { name: "Makanan", value: 18000, color: "#a1b9e8" },
    { name: "Minuman", value: 31000, color: "#6ee7d0" },
    { name: "Snack", value: 22000, color: "#000000" },
    { name: "Lainnya", value: 31500, color: "#7bb8ff" },
];

const TRAFFIC_YEAR = [
    { name: "2026", value: 52.1, color: "#000000" },
    { name: "2025", value: 22.8, color: "#93b4fa" },
    { name: "2024", value: 13.9, color: "#8fe8b4" },
    { name: "2023", value: 11.2, color: "#adc6ec" },
];

const Y_TICKS = [0, 10000, 20000, 30000];
const formatTick = (v: number) => (v === 0 ? "0" : `${v / 1000}K`);

// Chart bar yang dipakai Traffic by Month & Traffic by Category
const TrafficBarChart = ({
    data,
    height = 220,
}: {
    data: { name: string; value: number; color: string }[];
    height?: number;
}) => (
    <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4b5563", fontSize: 15 }}
                interval={0}
            />
            <YAxis
                axisLine={false}
                tickLine={false}
                width={40}
                ticks={Y_TICKS}
                domain={[0, 35000]}
                tickFormatter={formatTick}
                tick={{ fill: "#4b5563", fontSize: 13 }}
            />
            <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(v) => (v as number).toLocaleString("id-ID")}
            />
            <Bar dataKey="value" barSize={28} radius={14}>
                {data.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
);

const Overview = () => {
    const [hide, setHide] = useState(false);

    const handleClick = () => {
        setHide(!hide);
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} page={1} />

            <div className="w-full">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {/* Content */}
                <main className="px-7 py-5 space-y-5">
                    {/* Statistik */}
                    <div className="grid grid-cols-3 gap-5">
                        {STATS.map((stat) => (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-gray-300 px-6 py-5 space-y-1"
                            >
                                <p className="text-lg font-medium">{stat.title}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-semibold">{stat.value}</p>
                                    <p className="text-xs text-blue-600 flex items-center gap-1.5">
                                        {stat.growth}
                                        <Icon icon="lucide:trending-up" className="text-base" />
                                    </p>
                                </div>
                                <p className="text-gray-600">{stat.note}</p>
                            </div>
                        ))}
                    </div>

                    {/* Traffic by Month */}
                    <div className="rounded-2xl border border-gray-300 px-6 py-5 space-y-3">
                        <p className="text-lg font-medium">Traffic by Month</p>
                        <TrafficBarChart data={TRAFFIC_MONTH} />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Traffic by Category */}
                        <div className="rounded-2xl border border-gray-300 px-6 py-5 space-y-3">
                            <p className="text-lg font-medium">Traffic by Category</p>
                            <TrafficBarChart data={TRAFFIC_CATEGORY} height={190} />
                        </div>

                        {/* Traffic by Year */}
                        <div className="rounded-2xl border border-gray-300 px-6 py-5 space-y-5">
                            <p className="text-lg font-medium">Traffic by Year</p>
                            <div className="flex items-center gap-10">
                                <div className="size-30 shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={TRAFFIC_YEAR}
                                                dataKey="value"
                                                innerRadius={32}
                                                outerRadius={60}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                            >
                                                {TRAFFIC_YEAR.map((item) => (
                                                    <Cell key={item.name} fill={item.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="flex-1 space-y-2 pr-3">
                                    {TRAFFIC_YEAR.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="size-1.5 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <p>{item.name}</p>
                                            </div>
                                            <p>{item.value}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Overview;