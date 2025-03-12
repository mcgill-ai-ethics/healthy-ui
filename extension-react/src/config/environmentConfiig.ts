import { Environment } from "../common/enums";

const environmentConfig = () => {
  const env = process.env.ENV;

  if (env === Environment.PROD) {
    return process.env.PROD_BACKEND_HOST;
  }
  return process.env.DEV_BACKEND_HOST + ":" + process.env.DEV_BACKEND_PORT;
}

export default environmentConfig;
