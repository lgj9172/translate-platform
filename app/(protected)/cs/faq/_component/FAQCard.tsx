import Card from "@/components/Card";
import { Faq } from "@/types/entities";
import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  faq: Faq;
}

export default function FaqCard({ faq }: Props) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card>
      <div className="flex flex-col gap-2">
        {/* 제목 */}
        <button
          type="button"
          onClick={toggle}
          className="flex gap-2 items-center"
        >
          <span className="font-bold">{faq.title}</span>
        </button>
        {/* 내용 */}
        <Collapse in={opened} transitionDuration={100}>
          <div className="text-[14px] text-[#4B4D4D]">{faq.description}</div>
        </Collapse>
      </div>
    </Card>
  );
}
