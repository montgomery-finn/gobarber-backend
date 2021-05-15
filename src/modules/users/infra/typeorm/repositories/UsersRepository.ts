import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import { getRepository, Not, Repository } from 'typeorm';
import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findAllProviders({
        exceptUserId,
    }: IListProvidersDTO): Promise<User[]> {
        return exceptUserId
            ? this.ormRepository.find({
                  where: {
                      id: Not(exceptUserId),
                      isProvider: true,
                  },
              })
            : this.ormRepository.find();
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.ormRepository.findOne({ where: { email } });
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.ormRepository.findOne({ where: { id } });
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(data);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}
