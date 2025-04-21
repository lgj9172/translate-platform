"use client";

import useUser from "@/hooks/useUser";
import { Center, Loader } from "@mantine/core";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Center mih="500px">
        <Loader color="orange" type="bars" />
      </Center>
    );
  }

  if (!user) {
    redirect("/signin");
  }

  return children;
}
