import * as packageJson from '../../package.json';

export class RelayInfoDoc {
  name: string;
  description = packageJson.description;
  pubkey: string;
  contact: string;
  supported_nips = packageJson.supportedNips;
  software = packageJson.repository.url;
  version = packageJson.version;

  constructor(env) {
    const { RELAY_NAME, RELAY_PUBKEY, RELAY_CONTACT } = env;
    this.name = RELAY_NAME;
    this.pubkey = RELAY_PUBKEY;
    this.contact = RELAY_CONTACT;
  }
}
