const maxWidthClasses = {
  sm: "max-w-[150px]",
  md: "max-w-[250px]",
  lg: "max-w-[350px]",
} as const;

const themes = {
  danger: "hover:bg-red-700 bg-red-600 focus:ring-red-500",
} as const;

interface Props {
  onClick: () => void;
  label: string | React.ReactElement;
  ariaLabel: string;
  maxWidth: keyof typeof maxWidthClasses;
  theme: keyof typeof themes;
}

export const Button = ({
  onClick,
  label,
  ariaLabel,
  maxWidth,
  theme,
}: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${maxWidthClasses[maxWidth]} text-center px-4 py-2 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 w-full ${themes[theme]}`}
    >
      {label}
    </button>
  );
};
