/** DRF paginated list for `GET accounts/admin/users/`. */
export type TAdminUserRow = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status: string;
  photo: string | null;
  review_count: number;
  helpful_votes: number;
  address: string;
  city: string;
  country: string;
  created_at: string;
  last_active: string;
};

export type TAdminUserListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TAdminUserRow[];
};

export type TAdminUserCreatePayload = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status: string;
};

export type TAdminUserPatchPayload = {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  status?: string;
  address?: string;
  city?: string;
  password?: string;
  password_confirm?: string;
};

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "business" | "user";
  status: "active" | "inactive" | "suspended";
  address: string;
  city: string;
  password: string;
  passwordConfirm: string;
};

export function adminUserDisplayName(row: TAdminUserRow): string {
  const n = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return n || row.username;
}

export function splitFullName(full: string): { first_name: string; last_name: string } {
  const t = full.trim();
  if (!t) return { first_name: "User", last_name: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first_name: t, last_name: "" };
  return { first_name: t.slice(0, i).trim(), last_name: t.slice(i + 1).trim() };
}

export function rowToFormValues(row: TAdminUserRow): UserFormValues {
  return {
    name: adminUserDisplayName(row),
    email: row.email,
    phone: row.phone || "",
    role: row.role as UserFormValues["role"],
    status: row.status as UserFormValues["status"],
    address: row.address || "",
    city: row.city || "",
    password: "",
    passwordConfirm: "",
  };
}

export function buildCreatePayload(values: UserFormValues): TAdminUserCreatePayload {
  const { first_name, last_name } = splitFullName(values.name);
  const email = values.email.trim();
  return {
    username: email,
    email,
    password: values.password,
    password_confirm: values.passwordConfirm,
    first_name,
    last_name,
    phone: values.phone.trim(),
    role: values.role,
    status: values.status,
  };
}

export function buildPatchPayload(values: UserFormValues): TAdminUserPatchPayload {
  const { first_name, last_name } = splitFullName(values.name);
  const email = values.email.trim();
  const body: TAdminUserPatchPayload = {
    username: email,
    email,
    first_name,
    last_name,
    phone: values.phone.trim(),
    role: values.role,
    status: values.status,
    address: values.address,
    city: values.city,
  };
  if (values.password.trim()) {
    body.password = values.password;
    body.password_confirm = values.passwordConfirm;
  }
  return body;
}
