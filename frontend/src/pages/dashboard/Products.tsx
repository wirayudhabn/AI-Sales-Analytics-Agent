import { useState } from "react";
import { Header, Sidebar } from "../../components";

const Products = () => {
    const [hide, setHide] = useState(false);
    
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
                    <p>Products</p>
                </main>
            </div>
        </div>
    )
}

export default Products;