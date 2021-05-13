import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(dto: IParseMailTemplateDTO): Promise<string> {
        return 'Mail Content';
    }
}
