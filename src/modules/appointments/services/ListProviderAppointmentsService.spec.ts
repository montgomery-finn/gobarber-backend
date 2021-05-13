import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let service: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        service = new ListProviderAppointmentsService(
            fakeAppointmentRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list day appointments', async () => {
        const appointment1 = await fakeAppointmentRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2021, 4, 20, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2021, 4, 20, 15, 0, 0),
        });

        const appointments = await service.execute({
            providerId: 'provider',
            day: 20,
            month: 5,
            year: 2021,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
