import type { ReactElement } from "react";

export type NavigationIconName = "overview" | "products" | "orders" | "iris";

const navigationIconPaths: Record<NavigationIconName, ReactElement> = {
  overview: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="14" y="4" width="6" height="16" rx="1" />
      <rect x="4" y="14" width="7" height="6" rx="1" />
    </>
  ),
  products: (
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m0 0-8-4.5m8 4.5V21" />
  ),
  orders: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5h6M9 10h6m-6 4h6m-6 4h4" />
    </>
  ),
  iris: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="4" />
      <path d="M8 3v3m8-3v3M8.5 11h.01m7 0h.01M9 15h6M1 10v5m22-5v5" />
    </>
  ),
};

export const NavigationIcon = ({
  name,
}: {
  name: NavigationIconName;
}): ReactElement => (
  <svg
    className="h-5 w-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {navigationIconPaths[name]}
  </svg>
);

type IconProps = {
  className?: string;
};

export const AddIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const EyeIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const ChevronLeftIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className }: IconProps): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
