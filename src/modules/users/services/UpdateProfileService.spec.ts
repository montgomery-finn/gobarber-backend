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
                name: 'joseia silva',
                email: 'joseia@silva.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update name and email', async () => {
        const user = await fakeUsersRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        const saveMethod = jest.spyOn(fakeUsersRepository, 'save');

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'joseia silva',
            email: 'joseia@silva.com',
        });

        expect(updatedUser.name).toBe('joseia silva');
        expect(updatedUser.email).toBe('joseia@silva.com');
        expect(saveMethod).toHaveBeenCalled();
    });

    it('should not be able to email to an email already in use', async () => {
        const admin = await fakeUsersRepository.create({
            name: 'Administrador',
            email: 'admin@admin.com',
            password: '123',
        });

        const user = await fakeUsersRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'joseia silva',
                email: 'admin@admin.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        const saveMethod = jest.spyOn(fakeUsersRepository, 'save');
        const generateHashMethod = jest.spyOn(fakeHashProvider, 'generateHash');

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'jose silva',
            email: 'jose@silva.com',
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
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'jose silva',
                email: 'jose@silva.com',
                password: '456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'jose silva',
                email: 'jose@silva.com',
                password: '456',
                oldPassword: '456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
