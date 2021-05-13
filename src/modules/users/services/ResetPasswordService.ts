import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Token does not exist');
        }

        const limit = addHours(userToken.createdAt, 2);

        if (isAfter(Date.now(), limit)) {
            throw new AppError('token expired');
        }

        const user = await this.usersRepository.findById(userToken.userId);

        if (!user) {
            throw new AppError('User does not exist');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        user.password = hashedPassword;

        await this.usersRepository.save(user);
    }
}
