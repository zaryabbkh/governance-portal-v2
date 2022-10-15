import { config } from "lib/config";

/* Spock URLs */
export const LOCAL_SPOCK_URL = config.LOCAL_SPOCK_URL;
export const GOERLI_SPOCK_URL = config.GOERLI_SPOCK_URL;
export const STAGING_MAINNET_SPOCK_URL = config.STAGING_MAINNET_SPOCK_URL;
export const MAINNET_SPOCK_URL = config.MAINNET_SPOCK_URL;

export enum QueryFilterNames {
  Active = 'active',
  PollId = 'pollId',
  Range = 'range',
  MultiHash = 'multiHash'
}
