const {
  MONGODB_HOST = 'mongodb://root:example@localhost:27017',
  JWT_ACCESS_SECRET = 'access_secret',
  JWT_ACCESS_EXPIRATION = '5m',
  JWT_REFRESH_SECRET = 'refresh_secret',
  JWT_REFRESH_EXPIRATION = '1d',
  JWT_REFRESH_REMEMBER_ME_EXPIRATION = '30d',
} = process.env;

export default {
  mongodb: {
    host: MONGODB_HOST,
  },
  jwt: {
    access: {
      secret: JWT_ACCESS_SECRET,
      expiration: JWT_ACCESS_EXPIRATION,
    },
    refresh: {
      secret: JWT_REFRESH_SECRET,
      expiration: JWT_REFRESH_EXPIRATION,
      rememberMeExpiration: JWT_REFRESH_REMEMBER_ME_EXPIRATION,
    },
  },
};
