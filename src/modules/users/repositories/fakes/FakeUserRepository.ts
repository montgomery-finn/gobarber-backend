import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';
import { uuid } from 'uuidv4';
import IUsersRepository from '../IUsersRepository';
import User from '../../infra/typeorm/entities/User';

export default class UsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findAllProviders({
        exceptUserId,
    }: IListProvidersDTO): Promise<User[]> {
        return exceptUserId
            ? this.users.filter(u => u.id !== exceptUserId)
            : this.users;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(u => u.email === email);
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.users.find(u => u.id === id);
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, data, { id: uuid(), createdAt: new Date() });

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const index = this.users.findIndex(u => u.id === user.id);

        this.users[index] = user;

        return user;
    }
}
