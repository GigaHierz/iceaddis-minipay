type Props = {
  title: string;
  onClick: () => void;
  widthFull?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

function PrimaryButton({
  title,
  onClick,
  widthFull = false,
  disabled,
  loading,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled ?? loading}
      className={`${
        widthFull ? "w-full" : "px-4"
      } ${className} font-bold border border-black bg-colors-secondary rounded-2xl py-3 flex justify-center items-center`}
    >
      {loading ? <>Loading...</> : title}
    </button>
  );
}

export default PrimaryButton;
