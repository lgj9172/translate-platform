import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUser } from "@/apis/user";
import { createClient } from "@/utils/supabase/client";

export default function useUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getUser,
    enabled: !!session, // 세션이 있을 때만 조회
  });

  const isLoading = isSessionLoading || isUserLoading;

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["session"] });
    queryClient.removeQueries({ queryKey: ["users", "me"] });
    router.push("/");
  };

  return { user, isLoading, isError, signOut };
}
