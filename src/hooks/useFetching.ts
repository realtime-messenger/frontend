import {useState} from "react";
import {ruLocale} from "../utils/locale";


type UseFetchingReturn = [
	fetching: (...args: any[]) => Promise<any>,
	isLoading: boolean,
	error: string | null,
	resetError: () => void,
];

export const useFetching = (
	callback: (...args: any[]) => Promise<any>
): UseFetchingReturn => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetching: (...args: any[]) => Promise<void> = async (...args: any[]) => {
		try {
			setIsLoading(true)
			return await callback(...args)
		} catch (e) {
			if (e.code === "ERR_NETWORK") {
				setError("Ошибка. Проверьте подключение к Интернету")
			}
			else if (e.status === 422) {
				setError("Ошибка валидации. Проверьте правильность введёныых значений")
			} else {
				setError(ruLocale(e.response.data.detail))
			}
		} finally {
			setIsLoading(false)
		}
	}

	const resetError = () => {
		setError(null)
	}

	return [fetching, isLoading, error, resetError]
}