import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '../../../services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
    public async Create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { email } = request.body;

            const service = container.resolve(SendForgotPasswordEmailService);

            await service.execute({ email });

            return response.status(204).json();
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
