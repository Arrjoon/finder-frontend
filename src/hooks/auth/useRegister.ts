import { useMutation } from "@tanstack/react-query";

import { REGISTER } from "@/lib/end-points";
import { apiClient } from "@/api/api-client";
import type { RegisterPayload, RegisterResponse } from "@/api-services/user/user-definations";

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiClient.post<RegisterResponse>(REGISTER, payload),
  });
