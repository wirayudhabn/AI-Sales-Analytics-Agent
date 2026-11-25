import { useState } from "react";
import { Icon } from "@iconify/react";
import { SidebarCashier } from "../../components";

type Category = "Makanan" | "Minuman" | "Camilan" | "Dessert";

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: Category;
    image: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
}

const unsplash = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

const FALLBACK_IMAGE = unsplash("photo-1509042239860-f550ce710b93");

const CATEGORIES: ("Semua" | Category)[] = [
    "Semua",
    "Makanan",
    "Minuman",
    "Camilan",
    "Dessert",
];

const MENU: MenuItem[] = [
    { id: 1, name: "Cappuccino", price: 25000, category: "Minuman", image: unsplash("photo-1509042239860-f550ce710b93") },
    { id: 2, name: "Flat White", price: 24000, category: "Minuman", image: unsplash("photo-1495474472287-4d71bcdd2085") },
    { id: 3, name: "Latte Art", price: 26000, category: "Minuman", image: unsplash("photo-1572442388796-11668a67e53d") },
    { id: 4, name: "Mocha Hot", price: 28000, category: "Minuman", image: unsplash("photo-1514432324607-a09d9b4aefdd") },
    { id: 5, name: "Americano", price: 18000, category: "Minuman", image: unsplash("photo-1461023058943-07fcbe16d735") },
    { id: 6, name: "Espresso", price: 20000, category: "Minuman", image: unsplash("photo-1517701604599-bb29b565090c") },
    { id: 7, name: "Caramel Macchiato", price: 30000, category: "Minuman", image: unsplash("photo-1541167760496-1628856ab772") },
    { id: 8, name: "Matcha Latte", price: 32000, category: "Minuman", image: unsplash("photo-1559496417-e7f25cb247f3") },
    { id: 9, name: "Iced Cappuccino", price: 27000, category: "Minuman", image: unsplash("photo-1497935586351-b67a49e012bf") },
    { id: 10, name: "Iced Latte", price: 26000, category: "Minuman", image: unsplash("photo-1517701604599-bb29b565090c") },
    { id: 11, name: "Iced Mocha", price: 29000, category: "Minuman", image: unsplash("photo-1572442388796-11668a67e53d") },
    { id: 12, name: "Cold Brew", price: 35000, category: "Minuman", image: unsplash("photo-1461023058943-07fcbe16d735") },
    { id: 13, name: "Fresh Lemonade", price: 22000, category: "Minuman", image: unsplash("photo-1544145945-f90425340c7e") },
    { id: 14, name: "Jus Jeruk", price: 20000, category: "Minuman", image: unsplash("photo-1600271886742-f049cd451bba") },
    { id: 15, name: "Air Mineral", price: 10000, category: "Minuman", image: unsplash("photo-1548839140-29a749e1cf4d") },
    { id: 16, name: "Es Teh Manis", price: 15000, category: "Minuman", image: unsplash("photo-1497935586351-b67a49e012bf") },
];

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

// Payment
type PaymentMethod = "Tunai" | "QRIS";

interface Receipt {
    number: string;
    date: string;
    method: PaymentMethod;
    cashier: string;
    items: CartItem[];
    total: number;
    paid: number;
    change: number;
}

const CASHIER_NAME = "Peter Parker";
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "x"];

const ReceiptRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between">
        <p>{label}</p>
        <p>{value}</p>
    </div>
);

const Cashier = () => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<"Semua" | Category>("Semua");
    const [cart, setCart] = useState<CartItem[]>([
        { id: 101, name: "Iced Tea", price: 18000, qty: 2 },
        { id: 102, name: "Iced Coffee", price: 18000, qty: 2 },
    ]);

    // Payment
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Tunai");
    const [cashReceived, setCashReceived] = useState("");
    const [receipt, setReceipt] = useState<Receipt | null>(null);

    const filteredMenu = MENU.filter(
        (item) =>
            (activeCategory === "Semua" || item.category === activeCategory) &&
            item.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const paid = paymentMethod === "QRIS" ? totalPrice : Number(cashReceived || 0);
    const change = Math.max(paid - totalPrice, 0);
    const canSubmit = paid >= totalPrice && cart.length > 0;

    const addToCart = (menu: MenuItem) => {
        setCart((prev) => {
            const exist = prev.find((item) => item.id === menu.id);
            if (exist) {
                return prev.map((item) =>
                    item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { id: menu.id, name: menu.name, price: menu.price, qty: 1 }];
        });
    };

    const changeQty = (id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty + delta } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const clearCart = () => setCart([]);

    const openPayment = () => {
        setPaymentMethod("Tunai");
        setCashReceived("");
        setShowPayment(true);
    };

    const handleKeypad = (key: string) => {
        if (key === "C") return setCashReceived("");
        if (key === "x") return setCashReceived((prev) => prev.slice(0, -1));
        setCashReceived((prev) => {
            if (prev === "" && key === "0") return prev;
            if (prev.length >= 9) return prev;
            return prev + key;
        });
    };

    const handleSubmit = () => {
        if (!canSubmit) return;
        setReceipt({
            number: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleDateString("en-GB"), // dd/mm/yyyy
            method: paymentMethod,
            cashier: CASHIER_NAME,
            items: cart,
            total: totalPrice,
            paid,
            change,
        });
        setShowPayment(false);
    };

    const closeReceipt = () => {
        setReceipt(null);
        clearCart();
    };

    return (
        <div className="flex min-h-dvh">
            {/* Sidebar */}
            <SidebarCashier page={1} />

            {/* Menu */}
            <main className="px-7 py-5 space-y-5 w-full h-screen overflow-y-auto">
                {/* Search Bar & Kategori */}
                <div className="flex items-center gap-3">
                    <div className="bg-gray-300/30 flex items-center gap-2 rounded-lg flex-1">
                        <Icon
                            icon="lucide:search"
                            className="text-gray-500 ml-3"
                            width={16}
                            height={16}
                        />

                        <input
                            type="search"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="py-2 pr-3 text-sm outline-none w-full bg-transparent"
                        />
                    </div>

                    <div className="flex gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300/50 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daftar Menu */}
                {filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-4 gap-5">
                        {filteredMenu.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="cursor-pointer text-left rounded-lg border border-gray-300 overflow-hidden bg-white hover:border-blue-600 transition-colors"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.currentTarget.src = FALLBACK_IMAGE;
                                    }}
                                    className="w-full aspect-7/5 object-cover"
                                />
                                <div className="px-3 py-2">
                                    <p className="text-lg font-semibold">{item.name}</p>
                                    <p className="text-gray-600">{formatRupiah(item.price)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">Menu tidak ditemukan</p>
                )}
            </main>

            <div className="bg-gray-300 w-0.5 self-stretch"></div>

            {/* Detail */}
            <div className="w-1/3 shrink-0 h-screen flex flex-col">
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-300">
                    <div>
                        <p className="text-2xl font-semibold">Detail Pesanan</p>
                        <p className="font-medium text-gray-600">{totalItems} item terpilih</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="cursor-pointer text-red-600 flex gap-2 items-center"
                    >
                        <Icon className="text-xl" icon="ant-design:clear-outlined" /> Clear
                    </button>
                </div>

                <div className="flex-1 px-7 py-5 space-y-3 overflow-y-auto">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="px-4 py-2 rounded-lg border border-gray-300 flex justify-between items-center"
                        >
                            <div>
                                <p className="text-lg font-semibold">{item.name}</p>
                                <p className="text-gray-600">{formatRupiah(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="flex items-center rounded-sm border border-gray-300 w-fit">
                                    <button
                                        onClick={() => changeQty(item.id, -1)}
                                        className="cursor-pointer px-3 py-1"
                                    >
                                        -
                                    </button>
                                    <p>{item.qty}</p>
                                    <button
                                        onClick={() => changeQty(item.id, 1)}
                                        className="cursor-pointer px-3 py-1"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-lg font-semibold">
                                    {formatRupiah(item.price * item.qty)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total & Pay */}
                <div className="px-7 py-5 border-t border-gray-300 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Total Tagihan</p>
                        <p className="text-lg font-semibold text-blue-600">
                            {formatRupiah(totalPrice)}
                        </p>
                    </div>
                    <button
                        onClick={openPayment}
                        disabled={cart.length === 0}
                        className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Icon icon="lucide:wallet" className="text-xl" />
                        Pay Now
                    </button>
                </div>
            </div>

            {/* Modal Transaksi */}
            {showPayment && (
                <div onClick={() => setShowPayment(false)} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div onClick={(e) => e.stopPropagation()} className="flex w-190 rounded-xl overflow-hidden">
                        {/* Kiri: ringkasan */}
                        <div className="w-100 bg-slate-800 text-white px-8 py-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                <p className="text-2xl font-semibold">Transaksi</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <p>Total item dipilih</p>
                                        <p>{totalItems}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Total tagihan</p>
                                        <p>{formatRupiah(totalPrice)}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Kembalian</p>
                                <p className="text-3xl font-semibold">{formatRupiah(change)}</p>
                            </div>
                        </div>

                        {/* Kanan: metode & keypad */}
                        <div className="flex-1 bg-white px-8 py-8 space-y-3">
                            <p className="text-2xl font-semibold">Pilih metode pembayaran</p>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setPaymentMethod("Tunai")}
                                    className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg border ${
                                        paymentMethod === "Tunai"
                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                            : "border-gray-700 text-gray-700"
                                    }`}
                                >
                                    <Icon icon="lucide:banknote" className="text-xl" /> Tunai
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("QRIS")}
                                    className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg border ${
                                        paymentMethod === "QRIS"
                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                            : "border-gray-700 text-gray-700"
                                    }`}
                                >
                                    <Icon icon="lucide:qr-code" className="text-xl" /> QRIS
                                </button>
                            </div>

                            <div className="border border-gray-300 rounded-lg px-3 py-2">
                                <p className="text-gray-600">Uang diterima</p>
                                <p className="text-2xl font-semibold text-right">{formatRupiah(paid)}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {KEYPAD.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleKeypad(key)}
                                        disabled={paymentMethod === "QRIS"}
                                        className={`cursor-pointer h-20 rounded-lg border text-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                            key === "C"
                                                ? "bg-red-600 border-red-600 text-white"
                                                : key === "x"
                                                ? "bg-amber-500 border-amber-500 text-white"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit}
                                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Struk */}
            {receipt && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="w-100 space-y-3">
                        <div className="bg-white rounded-xl px-8 py-8 text-lg">
                            <div className="text-center space-y-1 pb-5 border-b border-gray-300">
                                <p className="text-2xl font-semibold">Indo Cafe</p>
                                <p className="text-gray-600 text-base">Jl. raya cafe No.88 Denpasar</p>
                                <p className="text-gray-600 text-base">Tlp: (021) 123-4567</p>
                            </div>

                            <div className="py-5 border-b border-gray-300">
                                <ReceiptRow label="Nomor Struk" value={receipt.number} />
                                <ReceiptRow label="Tanggal" value={receipt.date} />
                                <ReceiptRow label="Metode Bayar" value={receipt.method} />
                                <ReceiptRow label="Kasir" value={receipt.cashier} />
                            </div>

                            <div className="py-5 border-b border-gray-300">
                                {receipt.items.map((item) => (
                                    <ReceiptRow
                                        key={item.id}
                                        label={`${item.name} x${item.qty}`}
                                        value={formatRupiah(item.price * item.qty)}
                                    />
                                ))}
                            </div>

                            <div className="py-4 border-b border-gray-300">
                                <ReceiptRow label="Total" value={formatRupiah(receipt.total)} />
                            </div>

                            <div className="py-4 border-b border-gray-300">
                                <ReceiptRow label="Bayar" value={formatRupiah(receipt.paid)} />
                                <ReceiptRow label="Kembali" value={formatRupiah(receipt.change)} />
                            </div>

                            <p className="text-center text-gray-600 text-base pt-5">
                                Terima kasih atas kunjungan Anda!
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={closeReceipt}
                                className="cursor-pointer bg-white py-2 rounded-lg"
                            >
                                Close
                            </button>
                            {/* Fitur print belum dibuat */}
                            <button className="cursor-pointer bg-blue-600 text-white py-2 rounded-lg">
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cashier;