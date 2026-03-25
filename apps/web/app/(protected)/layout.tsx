"use client";

import useUser from "@/hooks/useUser";
import { Center } from "@/components/ui/center";
import { Loader } from "@/components/ui/loader";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Center className="h-[500px]">
        <Loader />
      </Center>
    );
  }

  if (!user) {
    redirect("/signin");
  }

  return children;
}
