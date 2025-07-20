import { injectable } from 'inversify';
import { ApplicationConfig } from '../../types';

@injectable()
export class ConfigProvider {
  private config: ApplicationConfig;

  constructor(config: ApplicationConfig) {
    this.config = config;
  }

  getConfig(): ApplicationConfig {
    return this.config;
  }
}
