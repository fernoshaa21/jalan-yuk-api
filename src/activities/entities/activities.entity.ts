import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity/user.entity';

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

  @Column('decimal', { precision: 12, scale: 2 })
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

  @Column({ type: 'int', nullable: true })
  sellerId: number | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sellerId' })
  seller?: UserEntity | null;

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
