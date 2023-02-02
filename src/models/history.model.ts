import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, CreateDateColumn } from 'typeorm';
import { Property } from './property.model';

@Entity()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  value: string | number | boolean;

  @Column()
  unit: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Property, (property) => property.history)
  property: Property;

  public static from = ({ value, unit, property }: { value: string | number | boolean; unit: string; property: Property }) => {
    const history = new History();
    history.value = value;
    history.unit = unit;
    history.property = property;

    return history;
  };
}
