import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { container } from 'tsyringe';

export default class AppointmentsController {
    public async Create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const userId = request.user.id;
            const { providerId, date } = request.body;

            // a transformação de dados fica aqui, as regras de negócio ficam no service

            const createAppointmentService = container.resolve(
                CreateAppointmentService,
            );

            const appointment = await createAppointmentService.execute({
                providerId,
                userId,
                date,
            });

            return response.json(appointment);
        } catch (err) {
            return response.status(400).json({ message: err.message });
        }
    }
}
