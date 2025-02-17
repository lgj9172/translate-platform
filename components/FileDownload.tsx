import { getFile } from "@/apis/files";
import { useQuery } from "@tanstack/react-query";

export default function FileDownload({ fileId }: { fileId: string }) {
  const { data: file } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => getFile({ fileId }),
  });

  return (
    <div>
      <button type="button" className="text-[#3B82F6] font-bold">
        <span>{file?.name}</span>
      </button>
    </div>
  );
}
