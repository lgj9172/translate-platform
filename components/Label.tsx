interface Props {
  children: React.ReactNode;
}

export default function Label({ children }: Props) {
  return (
    <span
      className="
      text-zinc-500
        text-sm
        font-normal
        font-['SpoqaHanSans']
        leading-normal"
    >
      {children}
    </span>
  );
}
