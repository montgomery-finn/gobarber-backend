import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDayByProviderDTO from '@modules/appointments/dtos/IFindAllInDayByProviderDTO';
import ICreateAppointmentDTO from '../../dtos/ICreateAppointmentDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../IAppointmentsRepository';

export default class FakeAppointmentRepository
    implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        date,
        providerId,
        userId,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, providerId, userId });
        this.appointments.push(appointment);

        return appointment;
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const appointment = this.appointments.find(
            a => isEqual(a.date, date) && a.providerId === providerId,
        );
        return appointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            a =>
                a.providerId === providerId &&
                getMonth(a.date) + 1 === month &&
                getYear(a.date) === year,
        );
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: IFindAllInDayByProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            a =>
                a.providerId === providerId &&
                getDate(a.date) === day &&
                getMonth(a.date) + 1 === month &&
                getYear(a.date) === year,
        );
    }
}
