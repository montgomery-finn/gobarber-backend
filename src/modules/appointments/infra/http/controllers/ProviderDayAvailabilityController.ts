import { Request, Response } from 'express';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { container } from 'tsyringe';

export default class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { providerId } = request.params;
            const { day, month, year } = request.query;

            const service = container.resolve(
                ListProviderDayAvailabilityService,
            );

            const availability = await service.execute({
                providerId,
                day: Number(day),
                month: Number(month),
                year: Number(year),
            });

            return response.json(availability);
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
