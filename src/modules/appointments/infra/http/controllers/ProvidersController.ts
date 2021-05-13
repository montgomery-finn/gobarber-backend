import { Request, Response } from 'express';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const userId = request.user.id;

            const listProvidersService = container.resolve(
                ListProvidersService,
            );

            const providers = await listProvidersService.execute({
                userId,
            });

            return response.json(classToClass(providers));
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
