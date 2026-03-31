import { useMutation } from "@tanstack/react-query";

import { LOGIN } from "@/lib/end-points";
import { apiClient } from "@/api/api-client";

export type LoginPayload = {
  username: string;
  password: string;
};

export const useLogin = () =>
  useMutation({
    mutationFn: ({ username, password }: LoginPayload) =>
      apiClient.post(LOGIN, { username, password }),
  });
