interface Props {
  children: React.ReactNode;
}

export default function PageTitle({ children }: Props) {
  return (
    <span className="text-neutral-800 text-[28px] font-bold flex items-center gap-[8px]">
      {children}
    </span>
  );
}
