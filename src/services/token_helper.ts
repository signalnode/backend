import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/user';

const { JWT_SECRET, JWT_EXPIRY } = process.env;

const createAccessToken = (id: number, username: string) => {
  const accessToken = jwt.sign({ id, username }, JWT_SECRET!, { algorithm: 'HS256', expiresIn: JWT_EXPIRY! });

  return accessToken;
};

const createRefreshToken = (username: string) => {
  const refreshToken = jwt.sign({ username }, JWT_SECRET!, { algorithm: 'HS256' });
  return refreshToken;
};

export const createTokens = async (id: number, username: string) => {
  const accessToken = createAccessToken(id, username);
  const refreshToken = createRefreshToken(username);

  await UserModel.update({ token: refreshToken }, { where: { username } });

  return { accessToken, refreshToken };
};

export const validateToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (err) {
    return;
  }
};
