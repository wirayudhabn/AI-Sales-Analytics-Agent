import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "../icons";

export type Order = {
  orderNumber: string;
  date: string;
  product: string;
  category: string;
  quantity: number;
  price: number;
};

type NewOrder = Order;

type OrderHistorySectionProps = {
  orders: Order[];
  searchQuery: string;
  onAddOrder: (order: NewOrder) => void;
};

const pageSize = 10;

const formatRupiah = (amount: number): string =>
  `Rp${amount.toLocaleString("id-ID")}`;

const formatDate = (value: string): string => {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const headingCellClass =
  "relative flex-1 mt-[-1.00px] font-heading-6 font-[number:var(--heading-6-font-weight)] text-text-primary text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]";

const bodyCellClass =
  "relative flex-1 mt-[-1.00px] font-body font-[number:var(--body-font-weight)] text-text-secondary text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]";

const pageButtonClass =
  "flex flex-col w-7 h-7 items-center justify-center relative rounded-lg border border-solid border-border aspect-[1]";

export const OrderHistorySection = ({
  orders,
  searchQuery,
  onAddOrder,
}: OrderHistorySectionProps): ReactElement => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddHistoryOpen, setIsAddHistoryOpen] = useState(false);
  const [{ page: activePage, query: pageQuery }, setPageState] = useState({
    page: 1,
    query: searchQuery,
  });
  const [formError, setFormError] = useState("");

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("id-ID");
  const filteredOrders = orders.filter((order) =>
    [order.orderNumber, order.product, order.category].some((value) =>
      value.toLocaleLowerCase("id-ID").includes(normalizedQuery),
    ),
  );
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(
    pageQuery === searchQuery ? activePage : 1,
    totalPages,
  );
  const firstOrderIndex = (currentPage - 1) * pageSize;
  const visibleOrders = filteredOrders.slice(
    firstOrderIndex,
    firstOrderIndex + pageSize,
  );
  const firstDisplayedOrder =
    filteredOrders.length === 0 ? 0 : firstOrderIndex + 1;
  const lastDisplayedOrder = Math.min(
    firstOrderIndex + pageSize,
    filteredOrders.length,
  );

  const handleAddOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const orderNumber = String(formData.get("orderNumber") ?? "")
      .trim()
      .toUpperCase();
    const product = String(formData.get("product") ?? "").trim();
    const date = String(formData.get("date") ?? "");
    const category = String(formData.get("category") ?? "").trim();
    const quantity = Number(formData.get("quantity"));
    const price = Number(formData.get("price"));

    if (!orderNumber || !product || !date || !category) {
      setFormError("Lengkapi semua informasi order.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price < 1
    ) {
      setFormError("Jumlah dan harga harus lebih besar dari 0.");
      return;
    }

    if (orders.some((order) => order.orderNumber === orderNumber)) {
      setFormError("Nomor order sudah digunakan.");
      return;
    }

    onAddOrder({
      orderNumber,
      date: formatDate(date),
      product,
      category,
      quantity,
      price,
    });
    setPageState({ page: 1, query: searchQuery });
    setFormError("");
    setIsAddHistoryOpen(false);
    event.currentTarget.reset();
  };

  return (
    <>
      <section
        aria-labelledby="history-heading"
        className="relative flex w-full min-w-0 flex-col items-start gap-2 px-6 py-5"
      >
        <div className="items-center justify-between flex-[0_0_auto] flex relative self-stretch w-full">
          <h1
            id="history-heading"
            className="relative flex-1 font-heading-4 font-[number:var(--heading-4-font-weight)] text-text-primary text-[length:var(--heading-4-font-size)] tracking-[var(--heading-4-letter-spacing)] leading-[var(--heading-4-line-height)] [font-style:var(--heading-4-font-style)]"
          >
            History
          </h1>
          <button
            type="button"
            aria-label="Add history"
            onClick={() => {
              setFormError("");
              setIsAddHistoryOpen(true);
            }}
            className="inline-flex items-center gap-2 p-2 relative flex-[0_0_auto] bg-accent-primary rounded-lg"
          >
            <AddIcon className="w-4 h-4 relative aspect-[1] text-bg-primary" />
            <span className="relative w-fit mt-[-1.00px] font-heading-6 font-[number:var(--heading-6-font-weight)] text-bg-primary text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]">
              Add History
            </span>
          </button>
        </div>
        <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
          <div
            role="row"
            className="flex items-center justify-between px-0 py-3 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-border"
          >
            {[
              "Order #",
              "Tanggal",
              "Produk",
              "Kategori",
              "Jumlah",
              "Harga",
              "Total",
            ].map((heading) => (
              <div
                role="columnheader"
                key={heading}
                className={headingCellClass}
              >
                {heading}
              </div>
            ))}
            <div
              role="columnheader"
              className={`${headingCellClass} text-center`}
            >
              Aksi
            </div>
          </div>
          {visibleOrders.map((order) => (
            <div
              role="row"
              key={order.orderNumber}
              className="flex items-center justify-between px-0 py-3 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-border"
            >
              <div role="cell" className={bodyCellClass}>
                {order.orderNumber}
              </div>
              <div role="cell" className={bodyCellClass}>
                {order.date}
              </div>
              <div role="cell" className={bodyCellClass}>
                {order.product}
              </div>
              <div role="cell" className={bodyCellClass}>
                {order.category}
              </div>
              <div role="cell" className={bodyCellClass}>
                {order.quantity}
              </div>
              <div role="cell" className={bodyCellClass}>
                {formatRupiah(order.price)}
              </div>
              <div role="cell" className={bodyCellClass}>
                {formatRupiah(order.quantity * order.price)}
              </div>
              <div
                role="cell"
                className="flex h-5 items-center justify-center gap-1 relative flex-1 grow"
              >
                <button
                  type="button"
                  aria-label={`View order ${order.orderNumber}`}
                  onClick={() => setSelectedOrder(order)}
                  className="w-6 h-6 mt-[-2.00px] mb-[-2.00px] relative aspect-[1] text-text-secondary"
                >
                  <EyeIcon className="absolute inset-0 h-full w-full" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-0 py-2 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-fit font-body font-[number:var(--body-font-weight)] text-text-secondary text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
            Menampilkan {firstDisplayedOrder}-{lastDisplayedOrder} dari{" "}
            {filteredOrders.length} data
          </p>
          <nav
            aria-label="History pagination"
            className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
          >
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() =>
                setPageState({ page: Math.max(1, currentPage - 1), query: searchQuery })
              }
              className={pageButtonClass}
            >
              <ChevronLeftIcon className="w-4 h-4 relative aspect-[1]" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => setPageState({ page, query: searchQuery })}
                  className={
                    currentPage === page
                      ? "flex flex-col w-7 h-7 items-center justify-center gap-2.5 relative bg-accent-primary rounded-lg aspect-[1]"
                      : pageButtonClass
                  }
                >
                  <span
                    className={
                      currentPage === page
                        ? "w-fit font-heading-6 font-[number:var(--heading-6-font-weight)] text-bg-primary relative text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]"
                        : "w-fit font-heading-6 font-[number:var(--heading-6-font-weight)] text-text-secondary relative text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]"
                    }
                  >
                    {page}
                  </span>
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPageState({
                  page: Math.min(totalPages, currentPage + 1),
                  query: searchQuery,
                })
              }
              className={pageButtonClass}
            >
              <ChevronRightIcon className="w-4 h-4 relative aspect-[1]" />
            </button>
          </nav>
        </div>
      </section>
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-[360px] rounded-lg bg-bg-primary p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="order-detail-title"
                className="font-heading-4 font-[number:var(--heading-4-font-weight)] text-text-primary text-[length:var(--heading-4-font-size)] tracking-[var(--heading-4-letter-spacing)] leading-[var(--heading-4-line-height)] [font-style:var(--heading-4-font-style)]"
              >
                Order Detail
              </h2>
              <button
                type="button"
                aria-label="Close order detail"
                onClick={() => setSelectedOrder(null)}
                className="text-text-secondary"
              >
                ×
              </button>
            </div>
            <dl className="mt-4 space-y-2 font-body text-text-secondary">
              <div className="flex justify-between">
                <dt>Order #</dt>
                <dd>{selectedOrder.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tanggal</dt>
                <dd>{selectedOrder.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Produk</dt>
                <dd>{selectedOrder.product}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Total</dt>
                <dd>
                  {formatRupiah(selectedOrder.quantity * selectedOrder.price)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      {isAddHistoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-history-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setIsAddHistoryOpen(false)}
        >
          <div
            className="w-[360px] rounded-lg bg-bg-primary p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="add-history-title"
                className="font-heading-4 font-[number:var(--heading-4-font-weight)] text-text-primary text-[length:var(--heading-4-font-size)] tracking-[var(--heading-4-letter-spacing)] leading-[var(--heading-4-line-height)] [font-style:var(--heading-4-font-style)]"
              >
                Add History
              </h2>
              <button
                type="button"
                aria-label="Close add history dialog"
                onClick={() => setIsAddHistoryOpen(false)}
                className="text-text-secondary"
              >
                ×
              </button>
            </div>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleAddOrder}>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Order #
                <input
                  required
                  name="orderNumber"
                  className="rounded border border-border px-2 py-1"
                  placeholder="ORD000"
                />
              </label>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Tanggal
                <input
                  required
                  name="date"
                  type="date"
                  className="rounded border border-border px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Produk
                <input
                  required
                  name="product"
                  className="rounded border border-border px-2 py-1"
                  placeholder="Nama produk"
                />
              </label>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Kategori
                <input
                  required
                  name="category"
                  className="rounded border border-border px-2 py-1"
                  placeholder="Kategori produk"
                />
              </label>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Jumlah
                <input
                  required
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  className="rounded border border-border px-2 py-1"
                  placeholder="Jumlah"
                />
              </label>
              <label className="flex flex-col gap-1 font-body text-text-secondary">
                Harga
                <input
                  required
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  className="rounded border border-border px-2 py-1"
                  placeholder="Harga satuan"
                />
              </label>
              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                className="mt-2 rounded-lg bg-accent-primary px-3 py-2 font-heading-6 text-bg-primary"
              >
                Save History
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
