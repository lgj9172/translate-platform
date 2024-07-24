interface Props {
  children: React.ReactNode;
}

export default function LabelSection({ children }: Props) {
  return <div className="flex justify-between">{children}</div>;
}
