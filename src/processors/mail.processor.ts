import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailingService } from 'src/services/mailing.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailingService: MailingService) {}

  @Process()
  async handleSendMail(job: Job) {
    const { user, token } = job.data;
    await this.mailingService.sendUserConfirmation(user, token);
  }
}
