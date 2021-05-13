import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        });
    }

    public async sendMail({
        to,
        from,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            to: { name: to.name, address: to.email },
            from: {
                name: from?.name ?? 'Vitor Klein',
                address: from?.email ?? 'vitor@klein.com',
            },
            subject: 'Olha aqui rapidão',
            text: 'teste',
            html: await this.mailTemplateProvider.parse(templateData),
        });

        console.log('message id => ', message.messageId);
        console.log('Preview url => ', nodemailer.getTestMessageUrl(message));
    }
}
