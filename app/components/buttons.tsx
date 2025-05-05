import Link from "next/link";

const BaseButtonStyles = "relative inline-flex items-center justify-center rounded-lg transition-all duration-200 overflow-hidden group";

const PrimaryButton = ({ children, href = "#" }: { children: React.ReactNode, href?: string }) => (
  <Link
    href={href}
    className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 hover:scale-[1.02] shadow-md hover:shadow-lg shadow-blue-500/30 dark:shadow-blue-600/20`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </Link>
);

const SecondaryButton = ({ children, href = "#" }: { children: React.ReactNode, href?: string }) => (
  <Link
    href={href}
    className={`${BaseButtonStyles} px-6 py-3 text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 hover:scale-[1.02] shadow-sm hover:shadow-md shadow-blue-300/30 dark:shadow-blue-700/20 border border-blue-600 dark:border-blue-400`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </Link>
);

const TertiaryButton = ({ children, href = "#" }: { children: React.ReactNode, href?: string }) => (
  <Link
    href={href}
    className={`${BaseButtonStyles} px-4 py-2 text-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.02]`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </Link>
);

const AcceptButton = ({ children, href = "#" }: { children: React.ReactNode, href?: string }) => (
  <Link
    href={href}
    className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 hover:scale-[1.02] shadow-md hover:shadow-lg shadow-green-500/30 dark:shadow-green-600/20`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </Link>
);

const DenyButton = ({ children, href = "#" }: { children: React.ReactNode, href?: string }) => (
  <Link
    href={href}
    className={`${BaseButtonStyles} px-6 py-3 text-lg font-bold text-white bg-gradient-to-br from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 hover:scale-[1.02] shadow-md hover:shadow-lg shadow-red-500/30 dark:shadow-red-600/20`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  </Link>
);

export default PrimaryButton;
export { SecondaryButton, TertiaryButton, AcceptButton, DenyButton };
