import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';
import INotificationsRepository from '../INotificationsRepository';

export default class FakeNotificationsRepository
    implements INotificationsRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(
            notification,
            { id: new ObjectID() },
            content,
            recipientId,
        );

        this.notifications.push(notification);

        return notification;
    }
}
