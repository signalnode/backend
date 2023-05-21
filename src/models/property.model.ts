import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
  value: string | number | boolean;

  @Column()
  unit: string;

  @Column({ name: 'use_history' })
  useHistory: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Device, (device) => device.properties)
  device: Device;

  @OneToMany(() => History, (history) => history.property, { cascade: true, nullable: true })
  history?: History[];

  public static from = ({
    name,
    description,
    value,
    unit,
    useHistory,
  }: {
    name: string;
    description: string;
    value: string | number | boolean;
    unit: string;
    useHistory?: boolean;
  }) => {
    const property = new Property();
    property.name = name;
    property.description = description;
    property.value = value;
    property.unit = unit;
    property.useHistory = useHistory ?? false;

    return property;
  };

  // public static updateValue = (property: Property, response: [unknown, string | number | boolean]) => {
  //   if (property.useHistory) History.from({ value: property.value, unit: property.unit }).save();
  //   property.value = response[1];
  //   property.save(); // No need to wait for the response so no "await"
  // };
}
