export type LoginPayload={
    username:string;
    password:string;
}

export type LoginResponse={
    user:{
        id:number;
        username:string;
        email:string;
    };
}

/** Matches Django `UserRegistrationSerializer` (`accounts/register/`). */
export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
};

export type RegisterResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: string;
    phone?: string;
  };
  message?: string;
};