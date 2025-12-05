import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('booking')
export class NotificationProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<void> {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    
    if (job.name === 'send-confirmation') {
      const { bookingId, userId, tourId, email, tourName } = job.data;
      
      // Simulate sending email
      console.log(`📧 Sending confirmation email to ${email}`);
      console.log(`   Booking ID: ${bookingId}`);
      console.log(`   Tour: ${tourName}`);
      console.log(`   User ID: ${userId}`);
      
      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      // await this.emailService.sendConfirmationEmail(email, { bookingId, tourName });
    }
  }
}

