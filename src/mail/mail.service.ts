/*
https://docs.nestjs.com/providers#services
*/

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * sending email after user logged in his account
   * @param email the logged in user
   */
  async sendLogInEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Log in',
        html: `
            <div>
            <h2>Hi ${email}</h2>
            <p>You logged in to your account in ${today.toDateString()} at ${today.toLocaleTimeString()}</p>
            </div>
            `,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  /**
   * Sending verify email template
   * @param email email of the registered user
   * @param link link with id of the user and verification token
   */
  async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Verify your account',
        html: `
            <div>
            <h2>Hi verify your email address</h2>
            <p>You Click on the link in the below to activate account </p>
            <a href="${link}">Verify Your Account </a>
            </div>
            `,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
  /**
   * Sending reset password template
   * @param email email of the  user
   * @param link link with id of the user and reset password token
   */
  async sendResetPasswordTemplate(email: string, resetPasswordLink: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Reset password',
        html: `
            <div>
            <h2>Reset Your Password</h2>
            <a href="${resetPasswordLink}">Click here to reset password </a>
            </div>
            `,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }
}
