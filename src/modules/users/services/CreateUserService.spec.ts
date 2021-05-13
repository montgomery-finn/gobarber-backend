import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        const user = await createUserService.Execute({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create two users with the same email', async () => {
        const user = await createUserService.Execute({
            name: 'Vitor Klein',
            email: 'vitor@klein.com',
            password: '123',
        });

        await expect(
            createUserService.Execute({
                name: 'Vitor Klein',
                email: 'vitor@klein.com',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
