import { useMutation } from "@tanstack/react-query";

import { LOGIN } from "@/lib/end-points";
import { apiClient } from "@/api/api-client";

export type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      apiClient.post(LOGIN, { username: email, password }),
  });
