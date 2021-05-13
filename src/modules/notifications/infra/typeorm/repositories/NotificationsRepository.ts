import { Repository, getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';
import INotificationsRepository from '../../../repositories/INotificationsRepository';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';

export default class NotificationsRepository
    implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipientId,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}
