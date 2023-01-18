import { registerAs } from '@nestjs/config';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Mongo database connection config
 */
export default registerAs('mongodb', () => {
  const {
    MONGO_URI
  } = process.env;
  return {
    uri:`${MONGO_URI}`,
  };
});


