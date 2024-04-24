export default function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-red-500 text-xs font-normal leading-normal">
      {children}
    </span>
  );
}
