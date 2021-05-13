import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProvileService';

describe('UpdateProfileService', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let updateProfileService: UpdateProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(
            fakeHashProvider,
            fakeUsersRepository,
        );
    });

    it('should not be able to update non-existent user', async () => {
        expect(
            updateProfileService.execute({
                userId: '5464',
                name: 'Vitorina Klein',
                email: 'vitorina@klein.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update name and email', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        const saveMethod = jest.spyOn(fakeUsersRepository, 'save');

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Vitorina Klein',
            email: 'vitorina@klein.com',
        });

        expect(updatedUser.name).toBe('Vitorina Klein');
        expect(updatedUser.email).toBe('vitorina@klein.com');
        expect(saveMethod).toHaveBeenCalled();
    });

    it('should not be able to email to an email already in use', async () => {
        const admin = await fakeUsersRepository.create({
            name: 'Administrador',
            email: 'admin@admin.com',
            password: '123',
        });

        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Vitorina Klein',
                email: 'admin@admin.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        const saveMethod = jest.spyOn(fakeUsersRepository, 'save');
        const generateHashMethod = jest.spyOn(fakeHashProvider, 'generateHash');

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '456',
            oldPassword: '123',
        });

        const rightNewPassword = await fakeHashProvider.compareHash(
            '456',
            updatedUser.password,
        );
        expect(rightNewPassword).toBe(true);

        expect(saveMethod).toHaveBeenCalled();
        expect(generateHashMethod).toHaveBeenCalledWith('456');
    });

    it('should not be able to update password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Vitor Klein',
                email: 'vitor@klein.com',
                password: '456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Vitor Klein',
                email: 'vitor@klein.com',
                password: '456',
                oldPassword: '456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
