import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
    isProvider?: boolean;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async Execute({
        name,
        email,
        password,
        isProvider,
    }: IRequest): Promise<User> {
        const emailBeignUsed = await this.usersRepository.findByEmail(email);

        if (emailBeignUsed) {
            throw new AppError('Email already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
            isProvider,
        });

        await this.cacheProvider.invalidatePrefix('providers-list');

        return user;
    }
}
