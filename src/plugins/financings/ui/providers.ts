import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
    addNavMenuSection(
        {
            id: 'view-all-financings',
            label: 'Finance Applications',
            items: [
                {
                    id: 'view-all-financings',
                    label: 'Operations',
                    routerLink: ['/extensions/financings'],
                    // Icon can be any of https://core.clarity.design/foundation/icons/shapes/
                    icon: 'table',
                },
            ],
        },
        // Add this section before the "settings" section
        'customers',
    ),
];
