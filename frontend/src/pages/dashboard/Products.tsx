import { useState } from "react";
import { Header, Sidebar, Table, type TableColumn } from "../../components";

type Product = {
    id: string;
    tanggal: string;
    produk: string;
    kategori: string;
    stok: number;
    harga: number;
};

const columns: TableColumn<Product>[] = [
    { key: "id", header: "ID Produk" },
    { key: "tanggal", header: "Tanggal" },
    { key: "produk", header: "Produk" },
    { key: "kategori", header: "Kategori" },
    { key: "stok", header: "Stok" },
    {
        key: "harga",
        header: "Harga",
        render: (row) => `Rp${row.harga.toLocaleString("id-ID")}`,
    },
    {
        key: "aksi",
        header: "Aksi",
        align: "center",
        render: (row) => (
            <div className="flex items-center justify-center gap-2">
                <button type="button" onClick={() => console.log("edit", row.id)} className="text-blue-500 hover:text-blue-700" aria-label="Edit">
                    {/* ganti dengan icon pilihanmu */}
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" /></svg>
                </button>
                <button type="button" onClick={() => console.log("hapus", row.id)} className="text-red-500 hover:text-red-700" aria-label="Hapus">
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" /></svg>
                </button>
            </div>
        ),
    },
];

const products: Product[] = [
  {
    id: "PROD-001",
    tanggal: "2026-09-01",
    produk: "Kopi Susu Gula Aren",
    kategori: "Minuman",
    stok: 45,
    harga: 18000,
  },
  {
    id: "PROD-002",
    tanggal: "2026-09-02",
    produk: "Nasi Goreng Spesial",
    kategori: "Makanan Berat",
    stok: 20,
    harga: 25000,
  },
  {
    id: "PROD-003",
    tanggal: "2026-09-03",
    produk: "Roti Bakar Cokelat Keju",
    kategori: "Cemilan",
    stok: 30,
    harga: 15000,
  },
  {
    id: "PROD-004",
    tanggal: "2026-09-04",
    produk: "Es Teh Manis",
    kategori: "Minuman",
    stok: 100,
    harga: 5000,
  },
  {
    id: "PROD-005",
    tanggal: "2026-09-05",
    produk: "Mie Ayam Bakso",
    kategori: "Makanan Berat",
    stok: 25,
    harga: 20000,
  },
  {
    id: "PROD-006",
    tanggal: "2026-09-06",
    produk: "Dimsum Mentai",
    kategori: "Cemilan",
    stok: 40,
    harga: 22000,
  },
  {
    id: "PROD-007",
    tanggal: "2026-09-07",
    produk: "Matcha Latte",
    kategori: "Minuman",
    stok: 35,
    harga: 24000,
  },
  {
    id: "PROD-008",
    tanggal: "2026-09-08",
    produk: "Ayam Geprek Sambal Matah",
    kategori: "Makanan Berat",
    stok: 15,
    harga: 23000,
  },
  {
    id: "PROD-009",
    tanggal: "2026-09-09",
    produk: "Pisang Goreng Keju",
    kategori: "Cemilan",
    stok: 50,
    harga: 12000,
  },
  {
    id: "PROD-010",
    tanggal: "2026-09-10",
    produk: "Lemon Tea",
    kategori: "Minuman",
    stok: 60,
    harga: 8000,
  },
];

const Products = () => {
    const [hide, setHide] = useState(false);
    const [page, setPage] = useState(1);
    
    const handleClick = () => {
        setHide(!hide);
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} page={2} />

            <div className="w-full">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {/* Content */}
                <main className="px-7 py-5 space-y-5">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">Products</h1>
                        <button className="bg-blue-600 text-white rounded-lg p-2">+ Add Product</button>
                    </div>
                    <Table
                        columns={columns}
                        data={products}
                        totalData={20}
                        totalPages={2}
                        page={page}
                        pageSize={10}
                        onPageChange={setPage}
                        rowKey={(row) => row.id}
                    />
                </main>
            </div>
        </div>
    )
}

export default Products;