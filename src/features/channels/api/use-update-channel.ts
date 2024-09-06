import { useCallback, useMemo, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"channels">;
  name: string;
};
type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateChannel = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "settled" | null
  >(null);

  const isLoading = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.channels.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      setStatus("loading");

      try {
        setData(null);
        setError(null);

        const response = await mutation(values);

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
