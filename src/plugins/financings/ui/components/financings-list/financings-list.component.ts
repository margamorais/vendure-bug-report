import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TypedBaseListComponent, SharedModule } from '@vendure/admin-ui/core';
import gql from 'graphql-tag';
import { of, Subject } from 'rxjs';

const MOCK_DATA = [
    {
        id: '8200e8bf-2b39-4058-850f-fac2cf5cca34',
        operation: 'Simulation',
        status: '-',
        createdAt: '11/24/2023',
        updatedAt: '11/24/2023',
        financingAmount: 94499,
        term: 444,
        interestRate: 'Taxa Fixa',
        name: 'Margarida Morais',
        nif: '125435649',
        orderId: '2',
    },
    {
        id: '32daaf38-7798-4067-a4d2-8d609a7fae9f',
        operation: 'Prior decision',
        status: '-',
        createdAt: '11/24/2023',
        updatedAt: '11/24/2023',
        financingAmount: 305999,
        term: 480,
        interestRate: 'Taxa Fixa',
        name: 'Margarida Morais',
        nif: '141390174',
        orderId: '3',
    },
    {
        id: 'd2ab00f1-37c9-410c-972a-6dd8cb409f61',
        operation: 'Proposal',
        status: 'Proposal in funding',
        createdAt: '11/24/2023',
        updatedAt: '11/24/2023',
        financingAmount: 377999,
        term: 480,
        interestRate: 'Taxa Fixa',
        name: 'Margarida Morais',
        nif: '141390174',
        orderId: '4',
    },
    {
        id: '5d727d30-94d3-4540-88db-a372f67dc0ae',
        status: 'Proposal in funding',
        createdAt: '11/24/2023',
        updatedAt: '11/24/2023',
        financingAmount: 116999,
        term: 480,
        interestRate: 'Taxa Fixa',
        name: 'Margarida Morais',
        nif: '141390174',
        orderId: '5',
    },
];

const getFinancingsListDocument = gql(`
  query GetFinancingsList($options: FinancingsListOptions) {
    financings (options: $options) {
      items {
        id
        createdAt
        updatedAt
        operation
        status
        financingAmount
        term
        interestRate
        name
        nif
        orderId
      }
      totalItems
    }
  }
`);

@Component({
    selector: 'financings-list',
    templateUrl: './financings-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class FinancingListComponent extends TypedBaseListComponent<
    typeof getFinancingsListDocument,
    'financings'
> {
    private completed$ = new Subject<void>();

    readonly filters = this.createFilterCollection().connectToRoute(this.route);
    readonly sorts = this.createSortCollection()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .connectToRoute(this.route);

    // Mocked data
    private mockFinancings = {
        financings: {
            items: MOCK_DATA,
            totalItems: 10, // Total number of mocked items
        },
    };

    constructor() {
        super();

        // Use mock data instead of making a GraphQL query
        this.items$ = of(this.mockFinancings.financings.items);
        this.totalItems$ = of(this.mockFinancings.financings.totalItems);
    }

    // Override any methods that fetch data to return your mock data
    // For example, if you have a method to refresh the list, make it return the mock data
    refreshList() {
        this.items$ = of(this.mockFinancings.financings.items);
        this.totalItems$ = of(this.mockFinancings.financings.totalItems);
    }

    ngOnDestroy() {
        // Signal that the component is completed
        this.completed$.next();
        this.completed$.complete();
    }
}
