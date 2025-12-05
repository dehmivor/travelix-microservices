import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  private redis: Redis;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectQueue('booking')
    private bookingQueue: Queue,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  private async acquireLock(key: string, ttl: number = 5000): Promise<string | null> {
    const lockValue = `${Date.now()}-${Math.random()}`;
    const result = await this.redis.set(key, lockValue, 'EX', ttl / 1000, 'NX');
    return result === 'OK' ? lockValue : null;
  }

  private async releaseLock(key: string, lockValue: string): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, key, lockValue);
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const lockKey = `lock:booking:${dto.userId}:${dto.tourId}`;
    const lockValue = await this.acquireLock(lockKey, 5000);

    if (!lockValue) {
      throw new BadRequestException('Another booking is in progress. Please try again.');
    }

    try {
      // In production, fetch tour from tour-service
      // For now, mock tour data
      const mockTour = {
        id: dto.tourId,
        availableSlots: 10,
        price: 1000,
        name: 'Sample Tour',
      };

      if (mockTour.availableSlots < dto.numberOfGuests) {
        throw new BadRequestException('Not enough available slots');
      }

      const booking = this.bookingRepository.create({
        userId: dto.userId,
        tourId: dto.tourId,
        numberOfGuests: dto.numberOfGuests,
        totalPrice: mockTour.price * dto.numberOfGuests,
        status: 'pending',
      });

      const savedBooking = await this.bookingRepository.save(booking);

      // Push job to queue for notification
      await this.bookingQueue.add('send-confirmation', {
        bookingId: savedBooking.id,
        userId: dto.userId,
        tourId: dto.tourId,
        email: 'user@example.com', // In production, fetch from user-service
        tourName: mockTour.name,
      });

      return savedBooking;
    } finally {
      await this.releaseLock(lockKey, lockValue);
    }
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking> {
    return this.bookingRepository.findOne({ where: { id } });
  }
}

