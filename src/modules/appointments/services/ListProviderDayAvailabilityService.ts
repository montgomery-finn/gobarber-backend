import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface IRequest {
    providerId: string;
    year: number;
    month: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private ormRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        day,
        month,
        year,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.ormRepository.findAllInDayFromProvider({
            providerId,
            day,
            month,
            year,
        });

        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const now = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(
                a => getHours(a.date) === hour,
            );

            const verificationHour = new Date(year, month - 1, day, hour);

            return {
                hour,
                available:
                    !hasAppointmentInHour && isAfter(verificationHour, now),
            };
        });

        return availability;
    }
}
