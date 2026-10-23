const Header = ({
    hide,
    handleClick,
    searchValue,
    onSearchChange,
}: {
    hide: boolean;
    handleClick: () => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
}) => {
    return (
        <header className="px-7 py-5 flex justify-between items-center h-fit border-b border-gray-300 sticky top-0 bg-neutral-50">
            <button className="cursor-pointer" onClick={handleClick}>{hide ? "Open" : "Close"}</button>
            <input
                type="search"
                placeholder="Search"
                aria-label="Search orders"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                className="h-fit bg-gray-300/30 rounded-lg py-2 px-3 text-sm"
            />
        </header>
    )
}

export default Header;