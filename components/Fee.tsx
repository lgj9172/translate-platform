import { NumericFormat } from "react-number-format";

export default function Fee({ value, unit }: { value: number; unit: string }) {
  const unitLabel = { KRW: "원", USD: "달러" }[unit] || "";

  return (
    <div className="flex text-primary font-bold text-[16px]">
      <NumericFormat
        displayType="text"
        value={value}
        thousandsGroupStyle="thousand"
        thousandSeparator=","
      />
      <span>{unitLabel}</span>
    </div>
  );
}
