export interface UserPayload {
    id: string;
    email: string;
    fullName: string;
}
export interface LoginResponse {
    access_token: string;
    user: UserPayload;
}
