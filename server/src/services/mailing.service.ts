import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from 'src/entities/user.entity';
import { InjectQueue, Process } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;
  private passwordResetTemplate: handlebars.TemplateDelegate;

  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAILER_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      {
        from: {
          name: 'No-reply',
          address: process.env.MAIL_FROM,
        },
      },
    );

    // Load Handlebars templates
    this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
    this.passwordResetTemplate = this.loadTemplate('resetPasswordEmail.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, '../templates');
    const templatePath = path.join(templatesFolderPath, templateName);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  }

  @Process('sendUserConfirmation')
  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = `${process.env.CLIENT_URL}/verify-email/${user.id}/${token}`;
    const html = this.confirmationTemplate({ name: user.fullName, url });
    await this.transporter.sendMail({
      to: user.email,
      subject: 'Welcome user! Confirm your Email',
      html: html,
    });
  }
  @Process('sendPasswordReset')
  async sendPasswordReset(user: UserEntity, token: string) {
    const url = `${process.env.CLIENT_URL}/resetpassword/${user.id}/${token}`;
    const html = this.passwordResetTemplate({ name: user.fullName, url });
    await this.transporter.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: html,
    });
  }

  async queueUserConfirmation(user: UserEntity, token: string) {
    return this.mailQueue.add('sendUserConfirmation', { user, token });
  }
  async queuePasswordReset(user: UserEntity, token: string) {
    return this.mailQueue.add('sendPasswordReset', { user, token });
  }
}
