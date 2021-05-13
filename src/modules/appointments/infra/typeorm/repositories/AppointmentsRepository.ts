import { Repository, getRepository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '@modules/appointments/dtos/IFindAllInDayByProviderDTO';

class AppointmentsRepository implements IAppointmentRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        date,
        providerId,
        userId,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            date,
            providerId,
            userId,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, providerId },
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFiledName =>
                        `to_char(${dateFiledName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: IFindAllInDayByProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFiledName =>
                        `to_char(${dateFiledName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });
    }
}

export default AppointmentsRepository;
