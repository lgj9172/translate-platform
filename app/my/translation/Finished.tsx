import { getTranslations } from "@/apis/translations";
import MantineTranslationCard from "@/components/MantineTranslationCard";
import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export default function Finished() {
  const { data: translations } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <Stack>
      {translations?.map((translation) => (
        <MantineTranslationCard
          key={translation.translation_id}
          translation={translation}
          hasControl
        />
      ))}
    </Stack>
  );
}
