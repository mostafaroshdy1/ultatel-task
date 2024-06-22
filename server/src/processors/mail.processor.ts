import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailingService } from 'src/services/mailing.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailingService: MailingService) {}

  @Process('sendUserConfirmation')
  async handleSendConfirmationEmail(job: Job) {
    const { user, token } = job.data;
    await this.mailingService.sendUserConfirmation(user, token);
  }

  @Process('sendPasswordReset')
  async handleSendPasswordReset(job: Job) {
    const { user, token } = job.data;
    await this.mailingService.sendPasswordReset(user, token);
  }
}
