import { useState } from "react";
import { Header, Sidebar } from "../../components";

const Overview = () => {
    const [hide, setHide] = useState(false);

    const handleClick = () => {
        setHide(!hide);
    }
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar hide={hide} />

            <div className="w-full">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {/* Content */}
                <main className="px-7 py-5">
                    
                </main>
            </div>
        </div>
    )
}

export default Overview;