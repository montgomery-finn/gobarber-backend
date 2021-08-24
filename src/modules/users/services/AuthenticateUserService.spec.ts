import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUserService = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
        authenticateUserService = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await createUserService.Execute({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        expect(user).toHaveProperty('id');

        const response = await authenticateUserService.execute({
            email: 'jose@silva.com',
            password: '123',
        });

        expect(response).toHaveProperty('token');
    });

    it('should not be able to authenticate with worng email', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'jose@silva.com',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to autheticate with wrong password', async () => {
        const user = await createUserService.Execute({
            name: 'jose silva',
            email: 'jose@silva.com',
            password: '123',
        });

        await expect(
            authenticateUserService.execute({
                email: 'jose@silva.com',
                password: '456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
