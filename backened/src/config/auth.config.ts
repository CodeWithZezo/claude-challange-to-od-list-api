export const authConfig = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || "codewithzezo",
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "codewithzezo",
    accessTokenExpiry: "15mint",
    refreshTokenExpiry: "7d",
  },
  bcrypt: {
    saltRoundes: 10,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
};
