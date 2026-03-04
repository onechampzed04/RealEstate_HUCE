export const JWT_CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.JWT_SECRET || 'your_access_token_secret_key_change_in_production',
  ACCESS_TOKEN_EXPIRY: '30d',
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_key_change_in_production',
  REFRESH_TOKEN_EXPIRY: '90d',
};

export default JWT_CONFIG;
