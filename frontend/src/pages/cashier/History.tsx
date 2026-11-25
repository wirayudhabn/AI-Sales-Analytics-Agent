import { useState } from "react";
import { SidebarCashier, Table, TableColumn } from "../../components";

type Transaction = {
    receiptNo: string;
    date: string;
    paymentMethod: string;
    itemCount: string;
    total: number;
};

// Data dummy. Nanti ganti dengan data dari API.
const TRANSACTIONS: Transaction[] = [
    {
        receiptNo: "TRX-1234",
        date: "03/01/2026",
        paymentMethod: "Iced Tea",
        itemCount: "Minuman",
        total: 18000,
    },
];

const PAGE_SIZE = 10;

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const History = () => {
    const [page, setPage] = useState(1);

    const handlePrint = (transaction: Transaction) => {
        console.log("print", transaction);
    };

    const columns: TableColumn<Transaction>[] = [
        { key: "receiptNo", header: "Nomor Struk" },
        { key: "date", header: "Tanggal" },
        { key: "paymentMethod", header: "Metode Bayar" },
        { key: "itemCount", header: "Jumlah Item" },
        {
            key: "total",
            header: "Total Tagihan",
            render: (row) => formatRupiah(row.total),
        },
        {
            key: "action",
            header: "Aksi",
            render: (row) => (
                <button
                    type="button"
                    onClick={() => handlePrint(row)}
                    aria-label="Cetak struk"
                    className="text-blue-600"
                >
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                        <path d="M19 8H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3zm-3 11H8v-5h8v5zm3-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM18 3H6v4h12V3z" />
                    </svg>
                </button>
            ),
        },
    ];

    // Pagination di sisi client (kalau dari API, cukup kirim `page` ke API)
    const totalData = TRANSACTIONS.length;
    const totalPages = Math.ceil(totalData / PAGE_SIZE);
    const currentData = TRANSACTIONS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="flex">
            {/* Sidebar */}
            <SidebarCashier page={2} />

            {/* Content */}
            <main className="w-full px-7 py-5 space-y-5">
                <h1 className="text-xl font-semibold">Riwayat</h1>

                <Table<Transaction>
                    columns={columns}
                    data={currentData}
                    totalData={totalData}
                    totalPages={totalPages}
                    page={page}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                    rowKey={(row) => row.receiptNo}
                />
            </main>
        </div>
    )
}

export default History;