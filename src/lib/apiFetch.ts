import { toast } from "sonner";

type ApiFetchOptions = RequestInit & {
  successMessage?: string;
  errorMessage?: string;
};

export async function apiFetch(url: string, options?: ApiFetchOptions) {
  const {
    successMessage,
    errorMessage,
    headers = {},
    ...fetchOptions
  } = options || {};

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers, // allow override
  };

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: defaultHeaders,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(errorMessage || data.error || "Request failed");
      throw new Error(data.error || "Request failed");
    }

    if (successMessage) {
      toast.success(successMessage);
    }

    return data;
  } catch (error) {
    toast.error(errorMessage || "Network or server error");
    throw error;
  }
}