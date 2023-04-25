
export interface Group {
    taskopen: any;
    open: boolean | undefined;
    id: number;
    name: string;
    members: User[] | null;
    tasks: Task[] | null;
    owner: User;
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
export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export interface Task {
    open: boolean | undefined;
    id: number|null;
    name: string;
    description: string;
    status: TaskStatus;
}
