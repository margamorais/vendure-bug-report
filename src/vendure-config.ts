import {
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    VendureConfig,
    LanguageCode,
    UuidIdStrategy,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { HardenPlugin } from '@vendure/harden-plugin';
import path from 'path';
import 'dotenv/config';

import fs from 'fs';
import { FinancingsPlugin } from './plugins/financings/financings.plugin';
import { customAdminUi } from './compile-admin-ui';

const IS_LOCAL = process.env.APP_ENV === 'local';
const IS_DEV = process.env.APP_ENV === 'dev' || IS_LOCAL;

export const config: VendureConfig = {
    entityOptions: {
        entityIdStrategy: IS_DEV ? undefined : new UuidIdStrategy(),
    },
    apiOptions: {
        port: process.env.PORT ? +process.env.PORT : 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        ...(IS_DEV
            ? {
                  adminApiPlayground: {
                      settings: { 'request.credentials': 'include' },
                  },
                  adminApiDebug: true,
                  shopApiPlayground: {
                      settings: { 'request.credentials': 'include' },
                  },
                  shopApiDebug: true,
              }
            : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET || '',
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        url: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/vendure_db',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: false,
        ssl: IS_LOCAL
            ? false
            : {
                  rejectUnauthorized: false,
              },
        migrations: [getMigrationsPath()],
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        HardenPlugin.init({
            maxQueryComplexity: 500,
            apiMode: IS_DEV ? 'dev' : 'prod',
        }),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            // For local dev, the correct value for assetUrlPrefix should
            // be guessed correctly, but for production it will usually need
            // to be set manually to match your production url.
            assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets',
            storageStrategyFactory: IS_LOCAL
                ? undefined
                : configureS3AssetStorage({
                      bucket: process.env.BUCKETEER_BUCKET_NAME || '',
                      credentials: {
                          accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID || '',
                          secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY || '',
                      },
                      nativeS3Configuration: {
                          region: process.env.BUCKETEER_AWS_REGION || '',
                      },
                  }),
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            route: 'mailbox',
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../static/email/templates'),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change',
            },
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
            adminUiConfig: {
                apiPort: IS_LOCAL ? 3000 : undefined,
                hideVersion: true,
                defaultLanguage: LanguageCode.en,
                availableLanguages: [LanguageCode.en],
            },
            app: customAdminUi({ recompile: IS_DEV, devMode: IS_DEV }),
        }),
        FinancingsPlugin
    ],
};

function getMigrationsPath() {
    const devMigrationsPath = path.join(__dirname, '../migrations/*.+(js|ts)');
    const distMigrationsPath = path.join(__dirname, './migrations/*.+(js|ts)');

    return fs.existsSync(distMigrationsPath)
        ? path.join(distMigrationsPath, '*.js')
        : path.join(devMigrationsPath, '*.ts');
}
