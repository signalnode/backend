import { randomUUID } from 'crypto';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Integration } from './integration.model';
import { Property } from './property.model';

@Entity({ name: 'devices' })
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'unique_id' })
  public uniqueId: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public activated: boolean;

  @Column({ type: 'simple-json', nullable: true })
  public configSchema?: object;

  @Column({ type: 'simple-json', nullable: true })
  public config?: object;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @ManyToOne(() => Integration, (integration) => integration.devices)
  @JoinColumn({ name: 'integration_id' })
  public integration: Integration;

  @ManyToMany(() => Property, (property) => property.devices, { cascade: true })
  @JoinTable()
  public properties?: Property[];

  public static from = ({
    name,
    description,
    activated,
    config,
    integration,
  }: {
    name: string;
    description: string;
    activated?: boolean;
    config?: object;
    integration: Integration;
  }) => {
    const device = new Device();
    device.uniqueId = randomUUID();
    device.name = name;
    device.description = description;
    device.activated = activated ?? false;
    device.configSchema = integration.configSchema;
    device.config = config;
    device.integration = integration;
    device.properties = integration.properties?.map((property) =>
      Property.from({
        name: property.name,
        description: property.description,
        value: property.value.toString(),
        type: typeof property.value,
        unit: property.unit,
        useHistory: property.useHistory,
      })
    );
    return device;
  };
}
