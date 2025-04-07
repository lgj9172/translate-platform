import { getUser, postLogout } from "@/apis/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useUser() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getUser,
  });

  const { mutate: signOut } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      router.push("/");
    },
  });

  return { user, signOut };
}
