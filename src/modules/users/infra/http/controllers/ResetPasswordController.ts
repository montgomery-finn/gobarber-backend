import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '../../../services/ResetPasswordService';

export default class ResetPasswordController {
    public async Create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { password, token } = request.body;

            const service = container.resolve(ResetPasswordService);

            await service.execute({ password, token });

            return response.status(204).json();
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
