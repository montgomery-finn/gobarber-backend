import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
    userId: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ userId }: IRequest): Promise<User[]> {
        // let providers = await this.cacheProvider.recover<User[]>(
        //     `providers-list:${userId}`,
        // );

        let providers;

        if (!providers) {
            providers = await this.usersRepository.findAllProviders({
                exceptUserId: userId,
            });

            await this.cacheProvider.save(
                `providers-list:${userId}`,
                classToClass(providers),
            );
        }

        return providers;
    }
}
