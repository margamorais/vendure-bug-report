import { InitialData, LanguageCode, bootstrap } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { config } from './src/vendure-config';
import { Permission } from '@vendure/common/lib/generated-types';
import path from 'path';

const productsCsvFile = path.join(__dirname, './populate-data.csv');

const initialData: InitialData = {
    paymentMethods: [
        {
            name: 'Standard Payment',
            handler: {
                code: 'dummy-payment-handler',
                arguments: [{ name: 'automaticSettle', value: 'false' }],
            },
        },
    ],
    roles: [
        {
            code: 'administrator',
            description: 'Administrator',
            permissions: [
                Permission.CreateCatalog,
                Permission.ReadCatalog,
                Permission.UpdateCatalog,
                Permission.DeleteCatalog,
                Permission.CreateSettings,
                Permission.ReadSettings,
                Permission.UpdateSettings,
                Permission.DeleteSettings,
                Permission.CreateCustomer,
                Permission.ReadCustomer,
                Permission.UpdateCustomer,
                Permission.DeleteCustomer,
                Permission.CreateCustomerGroup,
                Permission.ReadCustomerGroup,
                Permission.UpdateCustomerGroup,
                Permission.DeleteCustomerGroup,
                Permission.CreateOrder,
                Permission.ReadOrder,
                Permission.UpdateOrder,
                Permission.DeleteOrder,
                Permission.CreateSystem,
                Permission.ReadSystem,
                Permission.UpdateSystem,
                Permission.DeleteSystem,
            ],
        },
    ],
    defaultLanguage: LanguageCode.en,
    countries: [
        { name: 'Austria', code: 'AT', zone: 'Europe' },
        { name: 'Malaysia', code: 'MY', zone: 'Asia' },
        { name: 'United Kingdom', code: 'GB', zone: 'Europe' },
    ],
    defaultZone: 'Europe',
    taxRates: [
        { name: 'Standard Tax', percentage: 20 },
        { name: 'Reduced Tax', percentage: 10 },
        { name: 'Zero Tax', percentage: 0 },
    ],
    shippingMethods: [
        { name: 'Standard Shipping', price: 500 },
        { name: 'Express Shipping', price: 1000 },
    ],
    collections: [
        {
            name: 'Electronics',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: { facetValueNames: ['Electronics'], containsAny: false },
                },
            ],
            assetPaths: ['jakob-owens-274337-unsplash.jpg'],
        },
    ],
};

populate(() => bootstrap(config), initialData, productsCsvFile)
    .then(app => app.close())
    .then(
        () => process.exit(0),
        err => {
            console.log(err);
            process.exit(1);
        },
    );
