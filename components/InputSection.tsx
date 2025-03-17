interface Props {
  children: React.ReactNode;
}

export default function InputSection({ children }: Props) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
