import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  // @OneToMany(() => CardConfig, (config) => config.card)
  // configs?: CardConfig[];

  public static from = ({ type, config }: { type: string; config?: object }) => {
    const card = new Card();
    card.type = type;
    card.config = config ?? {}; // TODO: Should not be optional
    return card;
  };
}
