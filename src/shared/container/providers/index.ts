import { container } from 'tsyringe';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

import HandlebarsMailTamplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTamplateProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';

// esse aqui registra dentro do arquivo
// nas aulas todos foram feitos assim por terem mais de uma implementação
// eu não fiz as outras implementações pq precisava fazer conta na amazon
import './CacheProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTamplateProvider,
);

// aqui foi usado o registerInstance, pq o registerSingleton
// não executa o construtor
container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailProvider),
);
