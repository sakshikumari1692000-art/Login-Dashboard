export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    description: string;
    image: string;
    price: number;
    rating: number;
}
