import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
    sendMail(dto: ISendMailDTO): Promise<void>;
}
