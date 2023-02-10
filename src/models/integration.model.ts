import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Device } from '../device.model';

@Entity()
export class Integration extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;

  @Column({ type: 'simple-json' })
  configSchema: object;

  @Column({ nullable: false })
  author: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Device, (device) => device.integration, { cascade: true, eager: true })
  devices: Device[];

  //   public static from = ({
  //     name,
  //     description,
  //     version,
  //     author,
  //     activated,
  //     config,
  //     properties,
  //   }: {
  //     name: string;
  //     description: string;
  //     version: string;
  //     author: string;
  //     activated?: boolean;
  //     config?: object;
  //     properties: Property[];
  //   }) => {
  //     const addon = new Addon();
  //     addon.name = name;
  //     addon.description = description;
  //     addon.version = version;
  //     addon.author = author;
  //     addon.activated = activated ?? false;
  //     addon.config = config;
  //     addon.properties = properties;

  //     return addon;
  //   };
}
