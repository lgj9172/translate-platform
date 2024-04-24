interface Props {
  children: React.ReactNode;
}

export default function PageTitle({ children }: Props) {
  return (
    <span className="text-neutral-800 text-xl font-bold leading-loose">
      {children}
    </span>
  );
}
