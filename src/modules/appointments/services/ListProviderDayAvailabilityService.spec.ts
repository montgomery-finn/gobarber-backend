import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let service: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        service = new ListProviderDayAvailabilityService(
            fakeAppointmentRepository,
        );
    });

    it('should be able to list month availability from provider', async () => {
        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date(2021, 4, 20, 11, 0, 0);

            return customDate.getTime();
        });

        const availability = await service.execute({
            providerId: 'user',
            day: 20,
            month: 5,
            year: 2021,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 12, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
            ]),
        );
    });
});
