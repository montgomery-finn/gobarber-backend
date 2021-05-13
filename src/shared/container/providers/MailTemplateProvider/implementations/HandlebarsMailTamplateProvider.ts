import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandlebarsMailTamplateProvider
    implements IMailTemplateProvider {
    public async parse({
        file,
        variables,
    }: IParseMailTemplateDTO): Promise<string> {
        const template = await (await fs.promises.readFile(file)).toString();

        const parseTemplate = handlebars.compile(template);

        return parseTemplate(variables);
    }
}
