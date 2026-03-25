import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUser } from "@/apis/user";
import { createClient } from "@/utils/supabase/client";

export default function useUser() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getUser,
  });

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["users", "me"] });
    router.push("/");
  };

  return { user, isLoading, isError, signOut };
}
