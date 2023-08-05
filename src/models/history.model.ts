import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.model';

@Entity()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Property, (property) => property.history)
  property: Property;

  public static from = ({ value, property }: { value: unknown; property: Property }) => {
    const history = new History();
    history.value = value as string;
    history.property = property;

    return history;
  };
}
