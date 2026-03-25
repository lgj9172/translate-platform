interface Props {
  children: React.ReactNode;
}

export default function ControllerSection({ children }: Props) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
