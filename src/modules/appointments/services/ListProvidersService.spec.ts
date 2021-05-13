import AppError from '@shared/errors/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(
            fakeUserRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list providers', async () => {
        const user1 = await fakeUserRepository.create({
            name: 'User 1',
            email: 'user1@email.com',
            password: '123',
        });

        const user2 = await fakeUserRepository.create({
            name: 'User 2',
            email: 'user2@email.com',
            password: '123',
        });

        const user3 = await fakeUserRepository.create({
            name: 'User 2',
            email: 'user2@email.com',
            password: '123',
        });

        const providers = await listProvidersService.execute({
            userId: user3.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
