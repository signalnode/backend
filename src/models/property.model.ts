import { AfterLoad, BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Device } from './device.model';
import { History } from './history.model';

@Entity({ name: 'properties' })
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text' })
  type: string;

  @Column()
  unit: string;

  @Column({ name: 'use_history' })
  useHistory: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Device, (device) => device.properties)
  devices: Device[];

  @OneToMany(() => History, (history) => history.property, { cascade: true, nullable: true })
  history?: History[];

  public static from = ({
    name,
    description,
    value,
    type,
    unit,
    useHistory,
  }: // device,
  {
    name: string;
    description: string;
    value: string;
    type: string;
    unit: string;
    useHistory?: boolean;
    // device: Device;
  }) => {
    const property = new Property();
    property.name = name;
    property.description = description;
    property.value = value;
    property.type = type;
    property.unit = unit;
    property.useHistory = useHistory ?? false;
    // property.device = device;
    return property;
  };
}
