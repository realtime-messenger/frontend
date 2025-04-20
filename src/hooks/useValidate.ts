import {Dispatch, SetStateAction, useEffect, useState} from "react";


type ValidateCallback<T> = (value: T) => string[];
type UseValidateReturn<T> = [
	T,
	Dispatch<SetStateAction<T>>,
	boolean,
	boolean,
	string[]
];

export const useValidate = <T>(
	defaultValue: T,
	callback: ValidateCallback<T>,
	deps: any[] = []
): UseValidateReturn<T> => {
	const [value, setValue] = useState<T>(defaultValue);
	const [errors, setErrors] = useState<string[]>([]);
	const [isValid, setIsValid] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(true);

	const validate = () => {
		const errorsList = callback(value);
		setErrors(errorsList);

		if (value === defaultValue) setIsEmpty(true)
		else setIsEmpty(false)

		if (errorsList.length > 0) setIsValid(false)
		else setIsValid(true)
	}

	useEffect(() => {
		validate()
	}, [value, ...deps]);

	return [value, setValue, isValid, isEmpty, errors];
}