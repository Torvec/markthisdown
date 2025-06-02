interface DropDownButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export default function DropDownButton({
  children,
  onClick,
}: DropDownButtonProps): React.ReactElement {
  return (
    <button
      className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
