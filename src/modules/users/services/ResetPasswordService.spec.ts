import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
        fakeUserRepository,
        fakeUserTokensRepository,
        fakeHashProvider,
    );
});

describe('ResetPasswordService', () => {
    it('should be able to reset password using hash', async () => {
        const user = await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({ password: '456', token });

        const updatedUser = await fakeUserRepository.findById(user.id);

        const validPassword = await fakeHashProvider.compareHash(
            '456',
            updatedUser?.password as string,
        );

        await expect(validPassword).toBe(true);
    });

    it('should call hash function while reseting password', async () => {
        const generateHashMethod = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({ password: '456', token });

        await fakeUserRepository.findById(user.id);

        expect(generateHashMethod).toHaveBeenCalledWith('456');
    });

    it('should not be able to reset password with inexisting token', async () => {
        const user = await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await expect(
            resetPasswordService.execute({
                password: '456',
                token: 'sadasdasdasdasd',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password of inexisting user', async () => {
        const { token } = await fakeUserTokensRepository.generate('123');

        await expect(
            resetPasswordService.execute({ password: '456', token }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password after 2 hours from token generation', async () => {
        const user = await fakeUserRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({ password: '456', token }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
