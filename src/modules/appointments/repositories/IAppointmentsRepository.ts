import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthByProviderDTO from '../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '../dtos/IFindAllInDayByProviderDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        dto: IFindAllInMonthByProviderDTO,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        dto: IFindAllInDayByProviderDTO,
    ): Promise<Appointment[]>;
}
