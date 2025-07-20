import { ApplicationConfig } from '../types';

export interface IConfigProvider {
  getConfig(): ApplicationConfig;
}
