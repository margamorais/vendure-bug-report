import { registerRouteComponent } from '@vendure/admin-ui/core';
import { FinancingListComponent } from './components/financings-list/financings-list.component';

export default [
    registerRouteComponent({
        component: FinancingListComponent,
        path: '',
        title: 'Operations',
        breadcrumb: 'Operations',
    }),
];
