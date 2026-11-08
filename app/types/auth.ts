export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthSession = {
  userId: string;
  roles: string[];
  accessToken: string;
  accessTokenExpiration: string;
  refreshToken: string;
};
