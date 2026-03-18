import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from 'typeorm';
import { BookingEntity } from '../../bookings/entities/booking.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('payments')
@Index('IDX_PAYMENTS_STATUS', ['paymentStatus'])
@Index('IDX_PAYMENTS_CREATED_AT', ['createdAt'])
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => BookingEntity, (booking) => booking.payment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @RelationId((payment: PaymentEntity) => payment.booking)
  bookingId: string;

  @Column({ type: 'varchar', length: 50 })
  method: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  externalRef: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
