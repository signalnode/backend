import jwt from 'jsonwebtoken';
import { now } from 'sequelize/types/utils';

const { JWT_SECRET, JWT_EXPIRY } = process.env;

export const createAccessToken = (username: string) => {
  const accessToken = jwt.sign({ username }, JWT_SECRET!, { algorithm: 'HS256', expiresIn: JWT_EXPIRY! });
  return accessToken;
};

export const createRefreshToken = (username: string) => {
  const refreshToken = jwt.sign({ username }, JWT_SECRET!, { algorithm: 'HS256' });
  return refreshToken;
};

export const validateAccessToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET!);
  return payload;
};

export const checkTokenExpiry = (expiry: number, username: string) => {
  if (expiry - Date.now() < 0) {
    return { accessToken: createAccessToken(username), refreshToken: createRefreshToken(username) };
  }
};
