import { Request, Response } from 'express';
import UpdateProfileService from '@modules/users/services/UpdateProvileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;

        const showProfileService = container.resolve(ShowProfileService);

        const user = await showProfileService.execute({ userId });

        return response.json({ user: classToClass(user) });
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const userId = request.user.id;
            const { name, email, password, oldPassword } = request.body;

            const updateProfileService = container.resolve(
                UpdateProfileService,
            );

            const user = await updateProfileService.execute({
                userId,
                name,
                email,
                password,
                oldPassword,
            });

            return response.json({ user: classToClass(user) });
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}
