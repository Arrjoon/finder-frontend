import {
  COMPANY_USER_CREATE,
  COMPANY_USER_DELETE,
  COMPANY_USER_LIST,
  COMPANY_USER_UPDATE,
} from "@/lib/end-points";
import { apiClient } from "@/api/api-client";
import {
  CompanyUserApiDefinitions,
  TFetchCompanyUsersListRes,
  TCreateCompanyUserReq,
  TCreateCompanyUserRes,
  TCompanyUserRes,
} from "@/api-services/member/company-member-api-definitions";

class CompanyUserApiServices implements CompanyUserApiDefinitions {
  async fetchCompanyUsersList(
  ): Promise<TFetchCompanyUsersListRes[]> {
    const response = await apiClient.get<TFetchCompanyUsersListRes[]>(
      COMPANY_USER_LIST
    );
    return response.data;
  }

  async createCompanyUser(
    req: TCreateCompanyUserReq
  ): Promise<TCreateCompanyUserRes> {
    const response = await apiClient.post<TCreateCompanyUserRes>(
      COMPANY_USER_CREATE,
      req
    );
    return response.data;
  }

  async updateCompanyUser(
    req: TCreateCompanyUserReq,
    id: number
  ): Promise<TCreateCompanyUserRes> {
    const response = await apiClient.patch<TCreateCompanyUserRes>(
      COMPANY_USER_UPDATE(id),
      req
    );
    return response.data;
  }

  async deleteCompanyUser(id: number): Promise<void> {
    await apiClient.delete(COMPANY_USER_DELETE(id));
  }
}

export default new CompanyUserApiServices();
