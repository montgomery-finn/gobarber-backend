import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let service: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        service = new ListProviderMonthAvailabilityService(
            fakeAppointmentRepository,
        );
    });

    it('should be able to list month availability from provider', async () => {
        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 8, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 9, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 10, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 11, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 12, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 13, 0, 0),
        });

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

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 16, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 20, 17, 0, 0),
        });

        await fakeAppointmentRepository.create({
            providerId: 'user',
            userId: '456',
            date: new Date(2021, 4, 21, 17, 0, 0),
        });

        const availability = await service.execute({
            providerId: 'user',
            month: 5,
            year: 2021,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 19, available: true },
            ]),
        );
    });
});
