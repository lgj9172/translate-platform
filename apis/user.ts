"use server";

import { requireUser } from "@/lib/auth";
import { notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { User } from "@/types/entities";

export const getUser = async () => {
  const authUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { user_id: authUser.id },
    include: {
      translator: { select: { translator_id: true, is_deleted: true } },
    },
  });
  if (!user) throw notFound("사용자를 찾을 수 없습니다.");

  const is_translator = !!(user.translator && !user.translator.is_deleted);
  const authorization = {
    ...((user.authorization as Record<string, unknown>) ?? {}),
    is_translator,
  };

  return { ...user, authorization } as unknown as User;
};

export const getOtherUser = async ({ userId }: { userId: string }) => {
  await requireUser();
  const user = await prisma.user.findUnique({
    where: { user_id: userId, is_deleted: false },
    select: {
      user_id: true,
      name: true,
      nickname: true,
      avatar: true,
      authorization: true,
      created_at: true,
    },
  });
  if (!user) throw notFound("사용자를 찾을 수 없습니다.");
  return user as unknown as User;
};
