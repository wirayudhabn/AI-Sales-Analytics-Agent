import type { ReactNode } from "react";

export type TableColumn<T> = {
    key: string;
    header: ReactNode;
    render?: (row: T, index: number) => ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
};

type TableProps<T> = {
    columns?: TableColumn<T>[];
    data?: T[];
    totalData?: number;
    totalPages?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    rowKey?: (row: T, index: number) => string | number;
    emptyText?: string;
};

const ALIGN = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
} as const;

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) return [1, 2, 3, 4, "...", total];
    if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function Table<T>({
    columns = [],
    data = [],
    totalData = data.length,
    totalPages = 1,
    page = 1,
    pageSize = 10,
    onPageChange,
    rowKey,
    emptyText = "Tidak ada data",
}: TableProps<T>) {
    const start = totalData === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalData);
    const pages = getPageNumbers(page, totalPages);

    const goTo = (p: number) => {
        if (p < 1 || p > totalPages || p === page) return;
        onPageChange?.(p);
    };

    return (
        <div className="w-full space-y-4">
            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-160 text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`py-3 pr-4 font-semibold ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, i) => (
                                <tr
                                    key={rowKey ? rowKey(row, i) : i}
                                    className="border-b border-gray-200"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`py-3.5 pr-4 text-secondary ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`}
                                        >
                                            {col.render
                                                ? col.render(row, i)
                                                : (row as Record<string, ReactNode>)[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length || 1}
                                    className="py-8 text-center text-secondary"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer: info + pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-secondary">
                    {totalData > 0
                        ? `Menampilkan ${start}-${end} dari ${totalData.toLocaleString("id-ID")} data`
                        : "Tidak ada data"}
                </p>

                {totalPages > 1 && (
                    <nav className="flex items-center gap-1.5" aria-label="Pagination">
                        {/* Prev */}
                        <button
                            type="button"
                            onClick={() => goTo(page - 1)}
                            disabled={page <= 1}
                            aria-label="Halaman sebelumnya"
                            className="flex size-8 items-center justify-center rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        {pages.map((p, i) =>
                            p === "..." ? (
                                <span
                                    key={`dots-${i}`}
                                    className="flex size-8 items-center justify-center text-sm text-secondary"
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => goTo(p)}
                                    aria-current={p === page ? "page" : undefined}
                                    className={`flex size-8 items-center justify-center rounded-md text-sm transition-colors ${
                                        p === page
                                            ? "bg-blue-600 text-white"
                                            : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {p}
                                </button>
                            ),
                        )}

                        {/* Next */}
                        <button
                            type="button"
                            onClick={() => goTo(page + 1)}
                            disabled={page >= totalPages}
                            aria-label="Halaman berikutnya"
                            className="flex size-8 items-center justify-center rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        >
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}