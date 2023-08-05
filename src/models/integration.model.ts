import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Device } from './device.model';
import { Property } from './property.model';
import { SignalNodeProperty } from '@signalnode/types';

@Entity({ name: 'integrations' })
export class Integration extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;

  @Column()
  author: string;

  @Column({ type: 'simple-json', nullable: true })
  configSchema?: object;

  @Column({ type: 'simple-json', nullable: true })
  properties?: SignalNodeProperty<unknown, string>[];

  @Column({ name: 'use_foreign_properties' })
  useForeignProperties: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Device, (device) => device.integration)
  devices: Device[];

  public static from = ({
    name,
    description,
    version,
    author,
    configSchema,
    properties,
    useForeignProperties,
  }: {
    name: string;
    description: string;
    version: string;
    author: string;
    configSchema?: object;
    properties?: SignalNodeProperty<unknown, string>[];
    useForeignProperties?: boolean;
  }) => {
    const integration = new Integration();
    integration.name = name;
    integration.description = description;
    integration.version = version;
    integration.author = author;
    integration.configSchema = configSchema;
    integration.properties = properties;
    integration.useForeignProperties = useForeignProperties ?? false;
    return integration;
  };
}
