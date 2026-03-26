import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@translate/types";
import { getUser } from "@/apis/user";
import { createClient } from "@/utils/supabase/client";

interface UseUserOptions {
  initialUser?: User | null;
}

export default function useUser({ initialUser }: UseUserOptions = {}) {
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
    enabled: !!session,
    initialData: initialUser ?? undefined,
  });

  // SSR에서 initialUser를 받은 경우 로딩 상태를 건너뜀
  const isLoading =
    initialUser !== undefined ? false : isSessionLoading || isUserLoading;

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    // 전체 페이지 재로드로 모든 상태를 확실히 초기화
    window.location.href = "/";
  };

  return { user, isLoading, isError, signOut };
}
