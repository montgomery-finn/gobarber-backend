import { Request, Response } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class SessionsController {
    public async Create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { email, password } = request.body;

            const authenticateUserService = container.resolve(
                AuthenticateUserService,
            );

            const { token, user } = await authenticateUserService.execute({
                email,
                password,
            });

            return response.json({ token, user: classToClass(user) });
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
