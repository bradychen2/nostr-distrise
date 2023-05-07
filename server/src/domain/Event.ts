import * as crypto from 'crypto';
import * as secp from '@noble/secp256k1';

// an nostr event domain object
export class Event {
  id: string; // <32-bytes lowercase hex-encoded sha256 of the serialized event data>
  pubkey: string; // <32-bytes lowercase hex-encoded public key of the event creator>,
  created_at: number; // <unix timestamp in seconds>,
  kind: number;
  tags: string[][];
  content: string; // arbitrary string
  sig: string; // <64-bytes hex of the signature of the sha256 hash of the serialized event data, which is the same as the "id" field>

  constructor(
    event: Pick<Event, 'pubkey' | 'created_at' | 'kind' | 'tags' | 'content'>,
  ) {
    this.pubkey = event.pubkey;
    this.created_at = event.created_at;
    this.kind = event.kind;
    this.tags = event.tags;
    this.content = event.content;
    this.id = this.hash(this.serialize());
    this.sig = '';
  }

  public async sign(privateKey: string): Promise<void> {
    const sig = secp.utils.bytesToHex(
      await secp.schnorr.sign(this.id, privateKey),
    );
    const isValid = await secp.schnorr.verify(sig, this.id, this.pubkey);
    this.sig = sig.toString();
  }

  private serialize(): string {
    const data = [
      0,
      this.pubkey,
      this.created_at,
      this.kind,
      this.tags,
      this.content,
    ];
    return JSON.stringify(data);
  }

  private hash(serialized: string): string {
    const hash = crypto.createHash('sha256').update(serialized).digest('hex');
    return hash;
  }
}

// const id = await utils.sha256(Buffer.from(JSON.stringify(arr)));
// return Buffer.from(id).toString('hex') === this.id;
