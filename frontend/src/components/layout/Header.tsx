import { Icon } from "@iconify/react";

const Header = ({ hide, handleClick }: { hide: boolean; handleClick: () => void }) => {
    return (
        <header className="px-7 py-5 gap-2 flex justify-between items-center h-fit border-b border-gray-300 sticky top-0 bg-neutral-50 font-semibold">
            <button className="cursor-pointer" onClick={handleClick}><Icon className="text-xl" icon={hide ? "f7:sidebar-left" : "iconoir:sidebar-collapse"} /></button>
            
            {/* Search Bar */}
            <div className="bg-gray-300/30 flex items-center gap-2 rounded-lg">
                <Icon
                    icon="lucide:search"
                    className="text-gray-500 ml-3"
                    width={16}
                    height={16}
                />

                <input
                    type="search"
                    placeholder="Search"
                    className="py-2 pr-3 text-sm outline-none"
                />
            </div>
        </header>
    )
}

export default Header;