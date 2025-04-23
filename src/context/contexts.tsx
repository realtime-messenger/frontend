import {createContext} from "react";

interface AuthContextType {
	isLogged: boolean;
	setIsLogged: (isLogged: boolean) => void;
	userId: number
}

export const AuthContext = createContext<AuthContextType>(
	{
		isLogged: false,
		setIsLogged: () => {},
		userId: -1
	}
);
