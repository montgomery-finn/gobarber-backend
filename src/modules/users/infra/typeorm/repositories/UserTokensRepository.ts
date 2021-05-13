import { getRepository, Repository } from 'typeorm';
import IUserTokensRepository from '../../../repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async generate(userId: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({ userId });

        await this.ormRepository.save(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.ormRepository.findOne({ where: { token } });
    }
}
