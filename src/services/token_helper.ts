import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';

const { JWT_SECRET, JWT_EXPIRY } = process.env;

const createAccessToken = (id: number, username: string) => {
  const accessToken = jwt.sign({ id, username }, JWT_SECRET!, { algorithm: 'HS256', expiresIn: JWT_EXPIRY! });

  return accessToken;
};

const createRefreshToken = (id: number) => {
  const refreshToken = jwt.sign({ id }, JWT_SECRET!, { algorithm: 'HS256' });
  return refreshToken;
};

export const createTokens = async (id: number, username: string) => {
  const accessToken = createAccessToken(id, username);
  const refreshToken = createRefreshToken(id);

  await User.update({ token: refreshToken }, { where: { username } });

  return { accessToken, refreshToken };
};

export const validateToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (err) {
    return;
  }
};
