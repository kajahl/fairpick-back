import { Role } from "./Role";

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
}