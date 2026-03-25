import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Faq } from "@/types/entities";
import { useState } from "react";

interface Props {
  faq: Faq;
}

export default function FaqCard({ faq }: Props) {
  const [opened, setOpened] = useState(false);

  const handleChangeOpen = (open: boolean) => {
    if (!open) {
      setOpened(open);
    }
  };

  return (
    <Collapsible open={opened} onOpenChange={handleChangeOpen}>
      <Card>
        <div className="flex flex-col gap-2">
          {/* 제목 */}
          <CollapsibleTrigger asChild>
            <button type="button" className="flex gap-2 items-center">
              <span className="font-bold">{faq.title}</span>
            </button>
          </CollapsibleTrigger>
          {/* 내용 */}
          <CollapsibleContent>
            <div className="text-[14px] text-[#4B4D4D]">{faq.description}</div>
          </CollapsibleContent>
        </div>
      </Card>
    </Collapsible>
  );
}
