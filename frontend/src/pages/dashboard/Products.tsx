import { useState } from "react";
import { Header, Sidebar, Table, TableColumn } from "../../components";
import { Icon } from "@iconify/react";

type Product = {
    id: string;
    date: string;
    name: string;
    category: string;
    price: number;
};

// Data dummy (30 data). Nanti ganti dengan data dari API.
const PRODUCTS: Product[] = [
    { id: "IDM742", date: "03/01/2026", name: "Indomie Mi Goreng", category: "Makanan", price: 3500 },
    { id: "SOS318", date: "17/01/2026", name: "Teh Botol Sosro", category: "Minuman", price: 5000 },
    { id: "KPK905", date: "29/01/2026", name: "Kopiko Coffee", category: "Makanan", price: 8500 },
    { id: "TLA467", date: "08/02/2026", name: "Tolak Angin Cair", category: "Kesehatan", price: 4500 },
    { id: "SVQ821", date: "21/02/2026", name: "SilverQueen", category: "Makanan", price: 18000 },
    { id: "SRT256", date: "05/03/2026", name: "Sari Roti Tawar", category: "Makanan", price: 16500 },
    { id: "KPA693", date: "14/03/2026", name: "Kapal Api Special", category: "Minuman", price: 13000 },
    { id: "WRD184", date: "27/03/2026", name: "Wardah Lip Cream", category: "Kecantikan", price: 69000 },
    { id: "EGR530", date: "09/04/2026", name: "Eiger Waist Bag", category: "Aksesori", price: 179000 },
    { id: "BGT377", date: "22/04/2026", name: "Beng-Beng Regular", category: "Makanan", price: 2500 },
    // ...tambahkan sampai 30 data
];

const PAGE_SIZE = 10;

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const Products = () => {
    const [hide, setHide] = useState(false);
    const [page, setPage] = useState(1);

    const handleClick = () => {
        setHide(!hide);
    }

    const handleEdit = (product: Product) => {
        console.log("edit", product);
    };

    const handleDelete = (product: Product) => {
        console.log("delete", product);
    };

    const columns: TableColumn<Product>[] = [
        { key: "id", header: "ID Produk" },
        { key: "date", header: "Tanggal" },
        { key: "name", header: "Produk" },
        { key: "category", header: "Kategori" },
        {
            key: "price",
            header: "Harga",
            render: (row) => formatRupiah(row.price),
        },
        {
            key: "action",
            header: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" onClick={() => handleEdit(row)} aria-label="Edit" className="text-blue-600">
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <button type="button" onClick={() => handleDelete(row)} aria-label="Hapus" className="text-red-600">
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                            <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    // Pagination di sisi client (kalau dari API, cukup kirim `page` ke API)
    const totalData = PRODUCTS.length;
    const totalPages = Math.ceil(totalData / PAGE_SIZE);
    const currentData = PRODUCTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} page={2} />

            <div className="w-full">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {/* Content */}
                <main className="px-7 py-5 space-y-5">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Products</h1>
                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            // TODO: buka form tambah product
                            onClick={() => console.log("add product")}
                        >
                            <Icon className="text-lg" icon="akar-icons:plus" />
                            Add Product
                        </button>
                    </div>

                    <Table<Product>
                        columns={columns}
                        data={currentData}
                        totalData={totalData}
                        totalPages={totalPages}
                        page={page}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                        rowKey={(row) => row.id}
                    />
                </main>
            </div>
        </div>
    )
}

export default Products;