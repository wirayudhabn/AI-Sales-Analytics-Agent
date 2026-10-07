type PieItem = {
    chartItem: string;
    value: number;
    color?: string;
};

type PieProps = {
    title?: string;
    data?: PieItem[];
};

const DEFAULT_COLORS = ["#000000", "#93BFFF", "#86EFAC", "#B0C7EE"];

// Geometri donut
const SIZE = 200;
const CENTER = SIZE / 2;
const OUTER_R = 100;
const INNER_R = 52;
const GAP_DEG = 1.5;

const polarToCartesian = (r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: CENTER + r * Math.cos(rad),
        y: CENTER + r * Math.sin(rad),
    };
};

const describeSegment = (startAngle: number, endAngle: number) => {
    const outerStart = polarToCartesian(OUTER_R, startAngle);
    const outerEnd = polarToCartesian(OUTER_R, endAngle);
    const innerEnd = polarToCartesian(INNER_R, endAngle);
    const innerStart = polarToCartesian(INNER_R, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
        "Z",
    ].join(" ");
};

const PieChart = ({ title = "-", data = [] }: PieProps) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const segments = data.map((item, i) => {
        const before = data
            .slice(0, i)
            .reduce((sum, d) => sum + d.value, 0);

        const start = total > 0 ? (before / total) * 360 : 0;
        const end = total > 0 ? ((before + item.value) / total) * 360 : 0;
        const gap = data.length > 1 ? GAP_DEG / 2 : 0;

        return {
            ...item,
            color: item.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
            percent: total > 0 ? (item.value / total) * 100 : 0,
            path: describeSegment(start + gap, end - gap),
        };
    });

    return (
        <div className="border border-gray-300 rounded-2xl space-y-2 p-6 w-full">
            <p className="text-lg font-semibold">{title}</p>

            {data.length > 0 && total > 0 ? (
                <div className="flex w-full items-center gap-8 pt-4">
                    {/* Donut */}
                    <svg
                        viewBox={`0 0 ${SIZE} ${SIZE}`}
                        className="w-40 h-40 shrink-0"
                        role="img"
                        aria-label={title}
                    >
                        {segments.map((seg) => (
                            <path
                                key={seg.chartItem}
                                d={seg.path}
                                fill={seg.color}
                                stroke="#fff"
                                strokeWidth={2}
                                strokeLinejoin="round"
                                className="transition-all duration-300"
                            >
                                <title>
                                    {`${seg.chartItem}: ${seg.value.toLocaleString("id-ID")} (${seg.percent.toFixed(1)}%)`}
                                </title>
                            </path>
                        ))}
                    </svg>

                    {/* Legend */}
                    <ul className="flex-1 space-y-4">
                        {segments.map((seg) => (
                            <li
                                key={seg.chartItem}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-2 rounded-full shrink-0"
                                        style={{ backgroundColor: seg.color }}
                                    />
                                    <span className="text-base">{seg.chartItem}</span>
                                </div>
                                <span className="text-base">
                                    {seg.percent.toFixed(1)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center">Tidak ada data</p>
            )}
        </div>
    );
}

export default PieChart;