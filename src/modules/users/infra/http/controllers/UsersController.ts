import { Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import { container } from 'tsyringe';
import { hash } from 'bcryptjs';
import { classToClass } from 'class-transformer';

export default class UsersController {
    public async Create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { name, email, password } = request.body;

            const createUserService = container.resolve(CreateUserService);

            const user = await createUserService.Execute({
                name,
                email,
                password,
            });

            return response.json({ user: classToClass(user) });
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}
