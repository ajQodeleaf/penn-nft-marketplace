const ENV = process.env.NEXT_PUBLIC_ENV || "development";

const CONFIG = {
  development: {
    backendUrl: process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL,
  },
  production: {
    backendUrl: process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL,
  },
};

export const getConfig = () => CONFIG[ENV];
