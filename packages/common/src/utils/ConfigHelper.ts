import config from '@homzhub/common/src/config.json';

class ConfigHelper {
  public getBaseUrl = (): string => config.API_BASE_URL;
}

const configHelper = new ConfigHelper();
export { configHelper as ConfigHelper };
