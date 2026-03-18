import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity/user.entity';
import { ActivitiesEntity } from '../../activities/entities/activities.entity';
import { PaymentEntity } from '../../payments/entities/payment.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
@Index('IDX_BOOKINGS_CREATED_AT', ['createdAt'])
@Index('IDX_BOOKINGS_STATUS', ['status'])
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @RelationId((booking: BookingEntity) => booking.user)
  userId: number;

  @ManyToOne(() => ActivitiesEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'activityId' })
  activity: ActivitiesEntity;

  @RelationId((booking: BookingEntity) => booking.activity)
  activityId: number;

  @OneToOne(() => PaymentEntity, (payment) => payment.booking, {
    nullable: true,
  })
  payment?: PaymentEntity;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'int' })
  qty: number;

  @Column('numeric', { precision: 12, scale: 2 })
  unitPrice: string;

  @Column('numeric', { precision: 12, scale: 2 })
  totalPrice: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
