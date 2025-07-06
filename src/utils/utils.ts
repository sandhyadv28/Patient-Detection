import { environments } from '../config/config';

const currentEnv = (import.meta.env.VITE_ENV || "STAGING") as keyof typeof environments;

interface Config {
  env: typeof currentEnv;
  CLOUDPHYSICIAN_LOGIN_SERVICE: string;
  urls: string;
}

export const config: Config = {
  ...environments[currentEnv],
  env: currentEnv,
  urls: import.meta.env.VITE_API_URL || '',
};

export function redirectToLogin() {
  window.open(
    `${config.CLOUDPHYSICIAN_LOGIN_SERVICE}?redirectURI=${window.location.origin}&loginType=OTHER`,
    "_self"
  );
}