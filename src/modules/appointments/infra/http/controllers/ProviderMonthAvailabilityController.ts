import { Request, Response } from 'express';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { container } from 'tsyringe';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { providerId } = request.params;
            const { month, year } = request.query;

            const listProviderMonthAvailabilityService = container.resolve(
                ListProviderMonthAvailabilityService,
            );

            const availability = await listProviderMonthAvailabilityService.execute(
                {
                    providerId,
                    month: Number(month),
                    year: Number(year),
                },
            );

            return response.json(availability);
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
