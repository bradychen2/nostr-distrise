import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'event' })
export class EventModel {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;
  @Column({
    type: 'varchar',
  })
  event_id!: string; // <32-bytes lowercase hex-encoded sha256 of the serialized event data>
  @Column({
    type: 'varchar',
  })
  pubkey!: string; // <32-bytes lowercase hex-encoded public key of the event creator>,
  @Column({
    type: 'int',
  })
  created_at!: number; // <unix timestamp in seconds>,
  @Column({
    type: 'int',
  })
  kind!: number;
  @Column({
    type: 'varchar',
  })
  tags!: string;
  @Column({
    type: 'text',
  })
  content!: string; // arbitrary string
  @Column({
    type: 'varchar',
  })
  sig!: string; // <64-bytes hex of the signature of the sha256 hash of the serialized event data, which is the same as the "id" field>
}
