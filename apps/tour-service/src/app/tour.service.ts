import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class TourService {
  private redis: Redis;

  constructor(
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const tour = this.tourRepository.create(createTourDto);
    const savedTour = await this.tourRepository.save(tour);
    // Invalidate cache
    await this.redis.del('tours:all');
    return savedTour;
  }

  async findAll(): Promise<Tour[]> {
    const cacheKey = 'tours:all';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const tours = await this.tourRepository.find();
    // Cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(tours));
    return tours;
  }

  async findOne(id: number): Promise<Tour> {
    const cacheKey = `tour:${id}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const tour = await this.tourRepository.findOne({ where: { id } });
    if (tour) {
      // Cache for 5 minutes
      await this.redis.setex(cacheKey, 300, JSON.stringify(tour));
    }
    return tour;
  }

  async update(id: number, updateTourDto: UpdateTourDto): Promise<Tour> {
    await this.tourRepository.update(id, updateTourDto);
    // Invalidate cache
    await this.redis.del(`tour:${id}`);
    await this.redis.del('tours:all');
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tourRepository.delete(id);
    // Invalidate cache
    await this.redis.del(`tour:${id}`);
    await this.redis.del('tours:all');
  }
}

