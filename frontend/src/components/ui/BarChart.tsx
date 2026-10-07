type BarItem = {
    chartItem: string;
    value: number;
    color?: string;
};

type BarProps = {
    title?: string;
    data?: BarItem[];
    maxValue?: number;
};

const yTicks = [0, 10000, 20000, 30000];

const formatTick = (v: number) => (v === 0 ? "0" : `${v / 1000}K`);

const BarChart = ({
    title = "-",
    data = [],
    maxValue = 35000,
}: BarProps) => {
    // tinggi area chart (px)
    const chartHeight = 140;

    return (
        <div className="border border-gray-300 rounded-2xl space-y-2 p-6 w-full">
            <p className="text-lg font-semibold">{title}</p>

            {data.length > 0 ? (
                <div className="flex w-full gap-4 pt-4">
                    {/* Y Axis */}
                    <div
                        className="relative shrink-0 w-10"
                        style={{ height: chartHeight }}
                    >
                        {yTicks.map((tick) => (
                            <span
                                key={tick}
                                className="absolute right-0 text-sm text-secondary -translate-y-1/2"
                                style={{ bottom: `${(tick / maxValue) * 100}%` }}
                            >
                                {formatTick(tick)}
                            </span>
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex justify-between items-end min-w-160">
                            {data.map((item) => (
                                <div
                                    key={item.chartItem}
                                    className="flex flex-col items-center flex-1 gap-3"
                                >
                                    <div
                                        className="flex items-end"
                                        style={{ height: chartHeight }}
                                    >
                                        <div
                                            className="w-6 rounded-lg transition-all duration-300"
                                            style={{
                                                height: `${(item.value / maxValue) * 100}%`,
                                                backgroundColor: item.color ?? "#3B82F6",
                                            }}
                                            title={`${item.chartItem}: ${item.value.toLocaleString("id-ID")}`}
                                        />
                                    </div>
                                    <p className="text-sm text-secondary">{item.chartItem}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center">Tidak ada data</p>
            )}
        </div>
    );
}

export default BarChart;