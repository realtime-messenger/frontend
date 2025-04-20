export const validateFirstName = (value: string): string[] => {
	const errors: string[] = []

	if (value.length < 2) {
		errors.push('Имя не может быть меньше двух символов')
	}
	if (value.length > 12) {
		errors.push('Имя не может быть больше двенадцати символов')
	}

	for (let i = 0; i < 10; i ++) {
		if (value.includes(i.toString())) {
			errors.push('Имя не может содержать цифры')
		}
	}

	return errors
}


export const validateUsername = (value: string): string[] => {
	const errors: string[] = []

	if (value.length < 2) {
		errors.push('Логин не может быть меньше двух символов')
	}
	if (value.length > 20) {
		errors.push('Логин не может быть больше двенадцати символов')
	}

	for (let i = 0; i < 10; i ++) {
		if (value.includes(i.toString())) {
			errors.push('Логин не может содержать цифры')
		}
	}

	const bad_chars = "{}[]\\|/-=+. *%^&()"

	for (let i = 0; i < bad_chars.length; i++) {
		if (value.includes(
			bad_chars[i]
		)) {
			errors.push("Логин не может содержать спецсимволы")
			break
		}
	}

	return errors
}

export const validateEmail = (value: string): string[] => {
	const errors: string[] = []

	if (!value) {
		errors.push('Email не может быть пустым')
	}
	if (!/\S+@\S+\.\S+/.test(value)) {
		errors.push('Введите корректный email')
	}

	return errors
}

export const validatePassword = (value: string): string[] => {
	const errors: string[] = []

	if (value.length < 8) {
		errors.push('Пароль не может быть меньше восьми символов')
	}
	if (value.length > 20) {
		errors.push('Пароль не может быть больше двадцати символов')
	}
	if (!/(?=.*[a-zA-Z])/.test(value)) {
		errors.push('Пароль должен содержать хотя бы одну букву')
	}
	if (!/(?=.*[0-9])/.test(value)) {
		errors.push('Пароль должен содержать хотя бы одну цифру')
	}
	if (!/(?=.*[!@#$%^&*])/.test(value)) {
		errors.push('Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)')
	}

	return errors;
};

export const validatePasswordRepeat = (password: string, repeatPassword: string): string[] => {
	const errors: string[] = []

	if (password !== repeatPassword) {
		errors.push('Пароли не совпадают')
	}

	return errors
}


