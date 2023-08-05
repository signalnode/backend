import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CardConfig } from './card-config.model';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CardConfig, (config) => config.card)
  configs?: CardConfig[];

  public static from = ({ type, configs }: { type: string; configs?: CardConfig[] }) => {
    const card = new Card();
    card.type = type;
    card.configs = configs;
    return card;
  };
}
