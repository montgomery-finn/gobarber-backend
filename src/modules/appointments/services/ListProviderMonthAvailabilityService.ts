import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

interface IRequest {
    providerId: string;
    year: number;
    month: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private ormRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        month,
        year,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.ormRepository.findAllInMonthFromProvider(
            {
                providerId,
                month,
                year,
            },
        );

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month));

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(a => {
                return getDate(a.date) === day;
            });

            return {
                day,
                available:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}
