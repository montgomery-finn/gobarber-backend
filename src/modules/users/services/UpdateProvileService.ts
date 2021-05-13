import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    password?: string;
    oldPassword?: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject('HashProvider') private hashProvider: IHashProvider,
        @inject('UsersRepository') private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        userId,
        name,
        email,
        password,
        oldPassword,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('user not found');
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            const userWithThisEmail = await this.usersRepository.findByEmail(
                email,
            );

            if (userWithThisEmail && userWithThisEmail.id !== userId) {
                throw new AppError('email already in use');
            }
            user.email = email;
        }

        if (password) {
            if (!oldPassword) {
                throw new AppError(
                    'You must inform old password to update password',
                );
            }

            if (
                !(await this.hashProvider.compareHash(
                    oldPassword,
                    user.password,
                ))
            ) {
                throw new AppError('wrong old password');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}
