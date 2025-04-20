import {useContext, useState} from 'react';
import classes from "../Shared.module.css";
import {useValidate} from "../../../../hooks/useValidate";
import {Link} from "react-router-dom";
import {AuthContext} from "../../../../context/contexts";
import {useFetching} from "../../../../hooks/useFetching";
import {signinRequest} from "../../../../api/routes/auth";
import {setAccessToken, setRefreshToken} from "../../../../utils/localStorageManager";
import Input from "../../../component/Shared/Input/Input.tsx";
import Button from "../../../component/Shared/Button/Button.tsx";
import Modal from "../../../component/Shared/Modal/Modal.tsx";
import Attention from "../../../component/Shared/Attention/Attention.tsx";
import SmallLoader from "../../../component/Shared/Loader/SmallLoader.tsx";
import {
	validateFirstName,
	validatePassword,
	validatePasswordRepeat,
	validateUsername
} from "../../../../utils/validators.ts";

export const PRegistration = () => {

	const {setIsLogged} = useContext(AuthContext);

	const [fetchRegister, isLoading, registerError, resetRegisterError] = useFetching(async (
		firstName: string,
		lastName: string,
		middleName: string,
		username: string,
		password: string
		) => {
				const responseSignIn = await signinRequest(
					firstName,
					lastName,
					middleName,
					username,
					password
				);

			setAccessToken(responseSignIn.accessToken)
			setRefreshToken(responseSignIn.refreshToken)

			setIsLogged(true)

		}
	)

	const [firstName, setFirstName, firstNameValid, firstNameEmpty, firstNameErrors] = useValidate<string>("", validateFirstName)
	const [lastName, setLastName, lastNameValid, lastNameEmpty, lastNameErrors] = useValidate<string>("", validateFirstName)
	const [middleName, setMiddleName, middleNameValid, middleNameEmpty, middleNameErrors] = useValidate<string>("", validateFirstName)

	const [username, setEmail, usernameValid, usernameEmpty, usernameErrors] = useValidate<string>("", validateUsername)
	const [password, setPassword, passwordValid, passwordEmpty, passwordErrors] = useValidate<string>("", validatePassword)
	const [passwordRepeat, setPasswordRepeat, passwordRepeatValid, passwordRepeatEmpty, passwordRepeatErrors] = useValidate<string>("", (value) => validatePasswordRepeat(password, value), [password])

	const [validationError, setValidationError] = useState<string | null>(null)


	const onSubmit = () => {
		const validity = [firstNameValid, lastNameValid, middleNameValid, usernameValid, passwordValid, passwordRepeatValid]
		const emptiness = [firstNameEmpty, lastNameEmpty, middleNameEmpty, usernameEmpty, passwordEmpty, passwordRepeatEmpty]

		let anyEmpty = false;
		for (let i = 0; i < emptiness.length; i++) {
			if (emptiness[i]) {
				anyEmpty = true
				break
			}
		}

		let allValid = true;
		for (let i = 0; i < validity.length; i++) {
			if (!validity[i]) {
				allValid = false
				break
			}
		}

		if (anyEmpty) {
			setValidationError("Все поля должны быть заполнены")
			return
		}

		if (!allValid) {
			setValidationError("Все поля должны быть валидными")
			return;
		}

		setValidationError(null)

		fetchRegister(
			firstName,
			lastName,
			middleName,
			username,
			password
		)
	}


	return (
		<div className={classes.fullScreenContainer}>
			<img
				src="/messenger.svg"
				alt="Логотип"
			/>
			<Input
				error={firstNameErrors[0]}
				label={'Имя'}
				placeholder={'Введите ваше имя'}
				value={firstName}
				setValue={(value) => {setFirstName(value)}}
				empty={firstNameEmpty}
				extraClasses={classes.inputField}
			/>
			<Input
				error={lastNameErrors[0]}
				label={'Фамилия'}
				placeholder={'Введите вашу фамилию'}
				value={lastName}
				setValue={(value) => {setLastName(value)}}
				empty={lastNameEmpty}
				extraClasses={classes.inputField}
			/>
			<Input
				error={middleNameErrors[0]}
				label={'Отчество'}
				placeholder={'Введите ваше отчество'}
				value={middleName}
				setValue={(value) => {setMiddleName(value)}}
				empty={middleNameEmpty}
				extraClasses={classes.inputField}
			/>
			<Input
				error={usernameErrors[0]}
				value={username}
				setValue={(value) => {setEmail(value)}}
				label={'Логин'}
				placeholder={'Введите ваш логин'}
				empty={usernameEmpty}
				extraClasses={classes.inputField}
			/>
			<Input
				error={passwordErrors[0]}
				value={password}
				setValue={(value) => {setPassword(value)}}
				password
				label={'Пароль'}
				placeholder={'Введите ваш пароль'}
				empty={passwordEmpty}
				extraClasses={classes.inputField}
			/>
			<Input
				error={passwordRepeatErrors[0]}
				value={passwordRepeat}
				setValue={(value) => {setPasswordRepeat(value)}}
				password
				label={'Повтор пароля'}
				placeholder={'Повторите пароль'}
				empty={passwordRepeatEmpty}
				extraClasses={classes.inputField}
			/>

			<Button
				extraClasses={classes.inputField}
				black
				onClick={
					() => {
						onSubmit()
					}
				}
			>
				Регистрация
			</Button>

			<Link
				className={classes.goToText}
				to="/login"
			>
				Уже зарегистрированы? <div>Вход</div>
			</Link>


			<Modal
				active={registerError !== null}
				onClose={() => {
					resetRegisterError()
				}}
			>
				<Attention
					header={"Произошла ошибка"}
					message={registerError!}
					onClick={
						() => {
							resetRegisterError()
						}
					}
				/>
			</Modal>

			<Modal
				active={validationError !== null}
				onClose={() => {
					setValidationError(null)
				}}
			>
				<Attention
					header={"Произошла ошибка"}
					message={validationError!}
					onClick={
						() => {
							setValidationError(null)
						}
					}
				/>
			</Modal>

			<SmallLoader active={isLoading}/>

		</div>
	);
};

