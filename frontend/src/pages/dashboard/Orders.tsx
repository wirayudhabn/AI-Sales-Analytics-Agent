import { useMemo, useState } from "react";
import { Header, Sidebar, Table } from "../../components";
import type { TableColumn } from "../../components";

/* ---------- Data contoh (menu cafe, sama dengan ProductSeeder di backend) ---------- */

type OrderRow = {
    orderId: string;
    date: string;
    product: string;
    category: string;
    qty: number;
    price: number;
    total: number;
};

const MENU = [
    { name: "Espresso", category: "Kopi", price: 18000 },
    { name: "Cafe Latte", category: "Kopi", price: 25000 },
    { name: "Cappuccino", category: "Kopi", price: 23000 },
    { name: "Matcha Latte", category: "Minuman", price: 28000 },
    { name: "Lemon Tea", category: "Minuman", price: 15000 },
    { name: "Chicken Rice", category: "Makanan", price: 30000 },
    { name: "French Fries", category: "Snack", price: 18000 },
    { name: "Chocolate Cookies", category: "Snack", price: 12000 },
    { name: "Chocolate Cake", category: "Dessert", price: 22000 },
    { name: "Cheesecake", category: "Dessert", price: 27000 },
];

const QTY = [3, 6, 2, 5, 1, 4, 2, 3, 1, 2];

// 30 baris tetap (tidak acak) supaya tampilan konsisten setiap dimuat ulang.
// Nanti diganti dengan data dari backend.
const DUMMY_ORDERS: OrderRow[] = Array.from({ length: 30 }, (_, i) => {
    const item = MENU[(i * 3 + 1) % MENU.length];
    const qty = QTY[i % QTY.length];
    const date = new Date(2026, 0, 3 + i * 4);

    return {
        orderId: `ORD${101 + i * 29}`,
        date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }),
        product: item.name,
        category: item.category,
        qty,
        price: item.price,
        total: item.price * qty,
    };
});

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

/* ---------- Ikon ---------- */

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const EyeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/* ---------- Halaman ---------- */

const PAGE_SIZE = 10;

const Orders = () => {
    const [hide, setHide] = useState(false);
    const [page, setPage] = useState(1);

    const handleClick = () => {
        setHide(!hide);
    };

    // Ambil 10 baris untuk halaman yang sedang dibuka
    const rows = useMemo(
        () => DUMMY_ORDERS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [page],
    );

    const columns: TableColumn<OrderRow>[] = [
        { key: "orderId", header: "Order #" },
        { key: "date", header: "Tanggal" },
        { key: "product", header: "Produk" },
        { key: "category", header: "Kategori" },
        { key: "qty", header: "Jumlah" },
        { key: "price", header: "Harga", render: (row) => rupiah(row.price) },
        { key: "total", header: "Total", render: (row) => rupiah(row.total) },
        {
            key: "action",
            header: "Aksi",
            align: "center",
            render: (row) => (
                <button
                    type="button"
                    aria-label={`Lihat detail ${row.orderId}`}
                    className="cursor-pointer text-blue-600"
                    // TODO: buka detail order
                    onClick={() => console.log("detail", row.orderId)}
                >
                    <EyeIcon />
                </button>
            ),
        },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} page={3} />

            <div className="w-full min-w-0">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                <main className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">History</h1>
                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            // TODO: buka form tambah history
                            onClick={() => console.log("add history")}
                        >
                            <PlusIcon />
                            Add History
                        </button>
                    </div>

                    <Table
                        columns={columns}
                        data={rows}
                        totalData={DUMMY_ORDERS.length}
                        totalPages={Math.ceil(DUMMY_ORDERS.length / PAGE_SIZE)}
                        page={page}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                        rowKey={(row) => row.orderId}
                    />
                </main>
            </div>
        </div>
    );
};

export default Orders;