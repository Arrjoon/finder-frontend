export interface CompanyUserApiDefinitions {
  fetchCompanyUsersList: () => Promise<TFetchCompanyUsersListRes[]>;
  createCompanyUser: (req: TCreateCompanyUserReq) => Promise<TCreateCompanyUserRes>;
  updateCompanyUser: (req: TUpdateCompanyUserReq, id: number) => Promise<TCreateCompanyUserRes>;
  deleteCompanyUser: (id: number) => Promise<void>;
}

export type TFetchCompanyUsersListRes = {
  id: number;
  username: string | null;
  email: string | null;
  dispaly_name: string | null;
  profile_picture: string | null;
  is_active: boolean | null;
  is_banned: boolean | null;
  date_joined: string | null;
  last_login: string | null;
};

export type TCompanyUserRes = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  username: string;
  phone_number: string;
  is_active: boolean;
  is_tenant_admin: boolean;
  tenant?: number;
  tenant_name: string;
  date_joined: string;
  last_login: string;
};

export type TCreateCompanyUserReq = {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  profile_picture?: File | null;
  group_ids: number[];
};

export type TCreateCompanyUserRes = {
  id: number;
  username: string;
  email: string;
  display_name?: string | null;
  profile_picture?: string | null;
  is_active: boolean;
  is_banned: boolean;

};
export type TUpdateCompanyUserReq = TCreateCompanyUserReq;
