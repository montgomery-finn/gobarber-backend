import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
        fakeMailProvider,
        fakeUserRepository,
        fakeUserTokensRepository,
    );
});

describe('SendForgotPasswordEmail', () => {
    it('should be able to send password recover email', async () => {
        const sendMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jose@silva.com',
        });

        expect(sendMailMethod).toHaveBeenCalled();
    });

    it('should not be able to send password recover email to a non registered email', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'jose@silva.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate user token when sending email', async () => {
        const sendMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jose@silva.com',
        });

        expect(sendMailMethod).toHaveBeenCalled();
    });
});
