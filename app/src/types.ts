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

//typescript:
export enum FriendRequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    ACCEPT = 'ACCEPT',
    NONE = 'NONE',
}

export interface User {
    id: number;
    name: string;
    email: string;
    status: FriendRequestStatus|null;
}



export interface FriendRequest {
    id: number;
    recipient: User;
    sender: User;
    status: FriendRequestStatus;
}


