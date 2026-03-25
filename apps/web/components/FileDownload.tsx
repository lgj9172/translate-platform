import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/apis/files";
import { useFileDownload } from "@/hooks/useFileDownload";

interface Props {
  fileId: string;
  /** source_files에 이미 포함된 경우 별도 API 호출 생략 */
  presignedUrl?: string | null;
  name?: string;
}

export default function FileDownload({ fileId, presignedUrl, name }: Props) {
  const { downloadFile } = useFileDownload();

  const { data: file } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => getFile({ fileId }),
    enabled: !presignedUrl,
  });

  const resolvedUrl = presignedUrl ?? file?.presigned_url;
  const resolvedName = name ?? file?.name ?? fileId;

  const handleClickDownload = () => {
    if (resolvedUrl) {
      downloadFile(resolvedUrl, resolvedName);
    }
  };

  return (
    <button
      type="button"
      className="text-[#3B82F6] font-bold text-sm hover:underline"
      onClick={handleClickDownload}
      disabled={!resolvedUrl}
    >
      {resolvedName}
    </button>
  );
}
