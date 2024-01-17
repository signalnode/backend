import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.model';
import { Card } from './card.model';

@Entity()
export class CardConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'simple-json' })
  config: object; // TODO: Define object

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToMany(() => Dashboard)
  // @JoinTable()
  // dashboards: Dashboard;

  @ManyToOne(() => Card, (card) => card.config)
  card: Card;

  @ManyToMany(() => Property)
  @JoinTable()
  properties: Property[];

  public static from = ({ config, card, properties }: { config: object; card: Card; properties: Property[] }) => {
    const cardConfig = new CardConfig();
    cardConfig.config = config;
    cardConfig.card = card;
    cardConfig.properties = properties;
    return cardConfig;
  };
}
