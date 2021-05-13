import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    parse(dto: IParseMailTemplateDTO): Promise<string>;
}
