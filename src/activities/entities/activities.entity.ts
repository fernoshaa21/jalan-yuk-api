import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('activities')
export class ActivitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'maxParticipants', type: 'int' })
  availableSlots: number;

  @Column('int', { default: 0 })
  currentParticipants: number;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string | null;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'adventure', type: 'varchar' })
  category: string;

  @Column('decimal', { precision: 3, scale: 1, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Backward compatibility for existing services/mappers
  get name(): string {
    return this.title;
  }

  set name(value: string) {
    this.title = value;
  }

  // Backward compatibility for existing booking logic
  get maxParticipants(): number {
    return this.availableSlots;
  }

  set maxParticipants(value: number) {
    this.availableSlots = value;
  }
}
