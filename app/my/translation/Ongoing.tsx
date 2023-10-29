import { getTranslations } from "@/apis/translations";
import MantineTranslationCard from "@/components/MantineTranslationCard";
import { Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function Ongoing() {
  const { data: translations } = useQuery({
    queryKey: ["translations"],
    queryFn: getTranslations,
  });

  return (
    <Stack>
      {translations?.results?.map((translation) => (
        <MantineTranslationCard
          key={translation.id}
          translation={translation}
          hasControl
        />
      ))}
    </Stack>
  );
}
