import { TranslationCategory } from "@/types/entities";
import { getCategoryLabel } from "@/utils/converter/label";
import Badge from "./Badge";

export default function CategoryBadges({
  categories,
}: {
  categories: TranslationCategory[];
}) {
  return (
    <div className="flex gap-1">
      {categories.map((category: TranslationCategory) => (
        <Badge key={category} color="blue">
          {getCategoryLabel(category)}
        </Badge>
      ))}
    </div>
  );
}
