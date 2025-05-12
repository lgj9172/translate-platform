"use client";

import { getSelectedQuotation } from "@/apis/translations-quotations";
import { getMyTranslator } from "@/apis/translator";
import Button from "@/components/Button";
import StartTranslationModal from "@/modals/StartTranslationModal";
import { Translation } from "@/types/entities";
import { Center, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function StartTranslation({
  translation,
}: {
  translation: Translation;
}) {
  const [openStartTranslationModal, setOpenStartTranslationModal] =
    useState(false);

  const { data: selectedQuotation, isLoading: isSelectedQuotationLoading } =
    useQuery({
      queryKey: [
        "translations",
        translation.translation_id,
        "selected-quotation",
      ],
      queryFn: () =>
        getSelectedQuotation({ translationId: translation.translation_id }),
    });

  const { data: myTranslator, isLoading: isMyTranslatorLoading } = useQuery({
    queryKey: ["translators", "me"],
    queryFn: () => getMyTranslator(),
  });

  const isSelectedTranslator =
    selectedQuotation?.translator_id === myTranslator?.translator_id;

  const handleClickStartTranslation = () => {
    setOpenStartTranslationModal(true);
  };

  if (isSelectedQuotationLoading || isMyTranslatorLoading) {
    return (
      <Center mih="320px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

  if (!isSelectedTranslator) return null;

  return (
    <Stack>
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-xl font-bold text-gray-800">번역 시작</div>
        <p className="text-sm text-gray-600">
          번역할 준비가 되었다면 번역 시작을 눌러주세요.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          size="md"
          variant="primary"
          onClick={handleClickStartTranslation}
        >
          번역 시작
        </Button>
      </div>
      <StartTranslationModal
        open={openStartTranslationModal}
        onOpenChange={setOpenStartTranslationModal}
        translationId={translation.translation_id}
      />
    </Stack>
  );
}
