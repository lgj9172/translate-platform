import { Badge } from "@/components/ui/badge";
import type { TranslationCategory } from "@/types/entities";
import { getCategoryLabel } from "@/utils/converter/label";

export default function CategoryBadges({
  categories,
}: {
  categories: TranslationCategory[];
}) {
  return (
    <div className="flex gap-1">
      {categories.map((category: TranslationCategory) => (
        <Badge key={category} variant="secondary">
          {getCategoryLabel(category)}
        </Badge>
      ))}
    </div>
  );
}
