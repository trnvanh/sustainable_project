export type RegisterRequest = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export type AuthenticationRequest = {
    email: string;
    password: string;
}

export type RegisterResponse = {
    success: boolean;
    userData?: {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
        role: string;
    };
    message?: string;
}

export type AuthenticationResponse = {
    success: boolean
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
    };
}