import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";

type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "settled" | null
  >(null);

  const isLoading = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (_values: {}, options?: Options) => {
      setStatus("loading");

      try {
        setData(null);
        setError(null);

        const response = await mutation();

        setStatus("success");

        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");

        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation, setData, setError, setStatus]
  );

  return { mutate, data, error, isLoading, isSuccess, isError, isSettled };
};
