import { createContext, useEffect, useState } from "react";
import { AuthState, User, LoginCredentials, SignupCredentials } from "../types";


interface AuthContextType extends AuthState{
    login : (credentials: LoginCredentials) => Promise<void>;
    signup : (credentials: SignupCredentials) => Promise<void>;
    logout : () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "bookstore_users"; // stored registered users
const TOKEN_KEY = "token";

//store user datatype in localStorage

interface StoredUser{
    id: string;
    name: string;
    email: string;
    password: string;
}

//Get all registered users from localStorage 

const getStoredUsers = () : StoredUser[] =>{
    const data =  localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

//Save users to LocalStorage 
const saveUsers = (users : StoredUser): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

//Fake JWT token generator 
const fakeJWT = (user: User): string =>{
  const header = btoa(JSON.stringify({ alg:"HS256", typ : "JWT"}));
  const payload = btoa(JSON.stringify({...user,exp:Date.now() + 3600000}));
  return `${header}.${payload}.fake-signature`;
}

//Decode Token

const decodeToken = (token : string): User | null =>{
    try{
      const payload = JSON.parse(atob(token.split(".")[1]));
      if(payload.exp < Date.now()) return null;
      return{
        id:payload.id, 
        email:payload.email, 
        name:payload.name
    };
    }catch{
      return null;
    }
};

export const AuthProvider = ({children}:{children:ReactNode}) =>{
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated : false,
    });

// check token on mount
useEffect(()=>{
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
        const user = decodeToken(token);
        if(user){
            setAuthState({ user, token, isAuthenticated : true});
        }else{
            localStorage.removeItem(TOKEN_KEY);
        }
    }
},[]);
// Signup Stores user data in localStorage 
const signup =  async (credentials : SignupCredentials) : Promise<void> => {
    const users = getStoredUsers();
}
}


