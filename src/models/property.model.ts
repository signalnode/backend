import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Addon } from './addon.model';
import { History } from './history.model';

@Entity()
export class Property extends BaseEntity {
  // public constructor(name: string, description: string, value: string | number | boolean, unit: string, useHistory?: boolean) {
  //   super();
  //   this.name = name;
  //   this.description = description;
  //   this.value = value;
  //   this.unit = unit;
  //   this.useHistory = useHistory ?? false;
  // }

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Addon, (addon) => addon.properties)
  addon: Addon;

  @OneToMany(() => History, (history) => history.property, { cascade: true, nullable: true, eager: true })
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
