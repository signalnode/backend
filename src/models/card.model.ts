import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.model';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  type: string;

  @Column({ type: 'simple-json' })
  config: object; // TODO: Define object

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Property, { cascade: true })
  @JoinTable()
  properties: Property[];

  public static from = ({ type, config, properties }: { type: string; config: object; properties: Property[] }) => {
    const card = new Card();
    card.type = type;
    card.config = config;
    card.properties = properties;
    return card;
  };
}
