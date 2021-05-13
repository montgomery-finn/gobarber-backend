import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateAvatar', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update avatar from existing user', async () => {
        const user = await fakeUserRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existent user', async () => {
        await expect(
            updateUserAvatarService.execute({
                userId: '123',
                avatarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete current avatar and update avatar from existent user with avatar', async () => {
        const deleteFileMethod = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUserRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar.jpg',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar2.jpg',
        });

        expect(user.avatar).toBe('avatar2.jpg');
        expect(deleteFileMethod).toHaveBeenCalledWith('avatar.jpg');
    });
});
