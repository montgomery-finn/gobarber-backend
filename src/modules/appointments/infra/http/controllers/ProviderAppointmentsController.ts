import { Request, Response } from 'express';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const providerId = request.user.id;
            const { day, month, year } = request.query;

            const service = container.resolve(ListProviderAppointmentsService);

            const appointments = await service.execute({
                providerId,
                day: Number(day),
                month: Number(month),
                year: Number(year),
            });

            return response.json(classToClass(appointments));
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
