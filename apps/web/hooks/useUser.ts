import { getUser, postLogout } from "@/apis/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

  const { mutate: signOut } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["users", "me"],
      });
      router.push("/");
    },
  });

  return { user, isLoading, isError, signOut };
}
