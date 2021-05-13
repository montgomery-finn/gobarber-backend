import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ShowProfileService from './ShowProfileService';

describe('UpdateProfileService', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let showProfileService: ShowProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should not be able to show non-existent user', async () => {
        expect(
            showProfileService.execute({
                userId: '5464',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to show user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        const showUser = await showProfileService.execute({
            userId: user.id,
        });

        expect(showUser.name).toBe('Vitor Klein');
        expect(showUser.email).toBe('vitor@klein.com');
    });
});
