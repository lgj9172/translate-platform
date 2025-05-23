interface Props {
  children: React.ReactNode;
}

export default function Alert({ children }: Props) {
  return (
    <div className="w-full p-4 bg-[#F9FAFB] rounded-[8px] text-gray-500 text-center">
      {children}
    </div>
  );
}
