"use client";

import { Steps } from "@/components/Steps";
import { Progress } from "@/components/ui/Progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

const Page = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(50);
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const [file] = rejectedFiles;

      setIsDragOver(false);

      toast({
        title: `${file.file.type} type is not supported`,
        description: "Please choose a PNG, JPG, or JPEG image instead",
        variant: "destructive",
      });
    },
    [toast]
  );

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles, { configId: undefined });
      setIsDragOver(false);
    },
    [startUpload]
  );

  return (
    <>
      <Steps />
      <div
        className={cn(
          "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
          {
            "ring-blue-900/25 bg-blue-900/10": isDragOver,
          }
        )}
      >
        <div className="relative flex flex-1 flex-col items-center justify-center w-full">
          <Dropzone
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="h-full w-full flex-1 flex flex-col items-center justify-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragOver ? (
                  <MousePointerSquareDashed className="h6 w-6 text-zinc-600 mb-2" />
                ) : isUploading || isPending ? (
                  <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
                ) : (
                  <Image className="h-6 w-6 text-zinc-500 mb-2" />
                )}
                <div className="flex flex-col justify-center mb-2 text-sm text-zinc-500">
                  {isUploading ? (
                    <div className="flex flex-col flex-1">
                      <p>Uploading...</p>
                      <Progress
                        value={uploadProgress}
                        className="mt-2 w-40 h-2 bg-gray-300"
                      />
                    </div>
                  ) : isPending ? (
                    <div className="flex flex-col items-center">
                      <p>Redirecting please wait...</p>
                    </div>
                  ) : isDragOver ? (
                    <p>
                      <span className="font-semibold">Drop file</span>
                      to upload
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">Click to upload</span>{" "}
                      {""}
                      on drag and drop
                    </p>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </>
  );
};

export default Page;
