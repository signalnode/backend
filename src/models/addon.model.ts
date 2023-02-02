import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.model';

@Entity()
export class Addon extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;

  @Column({ nullable: false })
  author: string;

  @Column()
  activated: boolean;

  @Column({ type: 'simple-json', nullable: true })
  config?: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Property, (property) => property.addon, { cascade: true, eager: true })
  properties: Property[];

  public static from = ({
    name,
    description,
    version,
    author,
    activated,
    config,
    properties,
  }: {
    name: string;
    description: string;
    version: string;
    author: string;
    activated?: boolean;
    config?: object;
    properties: Property[];
  }) => {
    const addon = new Addon();
    addon.name = name;
    addon.description = description;
    addon.version = version;
    addon.author = author;
    addon.activated = activated ?? false;
    addon.config = config;
    addon.properties = properties;

    return addon;
  };
}
