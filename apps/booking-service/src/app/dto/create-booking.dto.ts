import { IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  tourId: number;

  @IsNumber()
  @Min(1)
  numberOfGuests: number;
}

