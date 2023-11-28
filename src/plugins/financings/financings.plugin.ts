// Core
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
// utils
import path from 'path';

export class FinancingsPlugin {
    static uiExtensions: AdminUiExtension = {
        extensionPath: path.join(__dirname, 'ui'),
        routes: [{ route: 'financings', filePath: 'routes.ts' }],
        providers: ['providers.ts'],
    };
}
