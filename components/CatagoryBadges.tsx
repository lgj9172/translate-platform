import { memo } from "react";
import { TranslationCategory } from "@/types/entities";
import { getCategoryLabel } from "@/utils/converter/label";
import Badge from "./Badge";

const CategoryBadges = memo(
  ({ categories }: { categories: TranslationCategory[] }) => (
    <div className="flex gap-1">
      {categories.map((category: TranslationCategory) => (
        <Badge key={category} color="blue">
          {getCategoryLabel(category)}
        </Badge>
      ))}
    </div>
  ),
);

export default CategoryBadges;
