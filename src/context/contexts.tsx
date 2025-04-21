import {createContext} from "react";

interface AuthContextType {
	isLogged: boolean;
	setIsLogged: (isLogged: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>(
	{
		isLogged: false,
		setIsLogged: () => {}
	}
);


interface WsContextType {
	client: object | null
}

export const WsContext = createContext<WsContextType>(
	{
		client: null
	}
);