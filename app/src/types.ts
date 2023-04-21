export interface Event {
    id: number;
    title: string;
    date: string;
}

export interface Group {
    id: number;
    name: string;
    address: string;
    city: string;
    stateOrProvince: string;
    country: string;
    postalCode: string;
    events: Event[] | null;
}

