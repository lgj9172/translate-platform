import { getFile } from "@/apis/files";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useQuery } from "@tanstack/react-query";

export default function FileDownload({ fileId }: { fileId: string }) {
  const { downloadFile } = useFileDownload();

  const { data: file } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => getFile({ fileId }),
  });

  const handleClickDownload = () => {
    if (file?.presigned_url) {
      downloadFile(file.presigned_url, file.name);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="text-[#3B82F6] font-bold"
        onClick={handleClickDownload}
      >
        <span>{file?.name}</span>
      </button>
    </div>
  );
}
