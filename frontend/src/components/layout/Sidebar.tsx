import { Link, NavLink } from "react-router-dom";
import { NavigationIcon } from "../icons";

const navigationItems = [
    { label: "Overview", to: "/overview", icon: "overview" },
    { label: "Products", to: "/products", icon: "products" },
    { label: "Orders", to: "/orders", icon: "orders" },
    { label: "Iris AI", to: "/iris-ai", icon: "iris" },
] as const;

const Sidebar = ({ hide }: { hide: boolean }) => (
    <nav
        aria-label="Primary navigation"
        className={`sticky top-0 flex h-dvh w-56 shrink-0 flex-col gap-3 border-r border-gray-300 p-4 transition-all ${
            hide ? "-ml-56" : "ml-0"
        }`}
    >
        <div className="p-2">
            <h2 className="text-blue-600">Iris</h2>
        </div>
        <div className="flex h-full flex-col gap-1 p-2">
            {navigationItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                        `inline-flex w-full items-center gap-2 rounded-lg p-2 ${
                            isActive ? "bg-blue-100 text-blue-600" : ""
                        }`
                    }
                >
                    <NavigationIcon name={item.icon} />
                    {item.label}
                </NavLink>
            ))}
        </div>
        <Link to="/sign-out" className="w-full rounded-lg p-2 text-red-600">
            Sign Out
        </Link>
    </nav>
);

export default Sidebar;