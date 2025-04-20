import {useContext, useState} from 'react';
import classes from '../Shared.module.css'
import {useValidate} from "../../../../hooks/useValidate";
import {Link} from "react-router-dom";
import {AuthContext} from "../../../../context/contexts";
import {useFetching} from "../../../../hooks/useFetching";
import {loginRequest} from "../../../../api/routes/auth";
import {setAccessToken, setRefreshToken} from "../../../../utils/localStorageManager";
import {validatePassword, validateUsername} from "../../../../utils/validators.ts";
import Input from "../../../component/Shared/Input/Input.tsx";
import Button from "../../../component/Shared/Button/Button.tsx";
import Modal from "../../../component/Shared/Modal/Modal.tsx";
import Attention from "../../../component/Shared/Attention/Attention.tsx";
import SmallLoader from "../../../component/Shared/Loader/SmallLoader.tsx";

export const PLogin = () => {

	const {setIsLogged} = useContext(AuthContext);

	const [fetchLogin, isLoading, loginError, resetLoginError] = useFetching(async (email: string, password: string) => {
			const response = await loginRequest(email, password);

			setAccessToken(response.accessToken)
			setRefreshToken(response.refreshToken)

			setIsLogged(true)
		}
	)

	const [username, setUsername, usernameValid, usernameEmpty, usernameErrors] = useValidate<string>("", validateUsername)
	const [password, setPassword, passwordValid, passwordEmpty, passwordErrors] = useValidate<string>("", validatePassword)

	const [validationError, setValidationError] = useState<string | null>(null)

	const onSubmit = () => {
		const validity = [usernameValid, passwordValid]
		const emptiness = [usernameEmpty, passwordEmpty]

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
		fetchLogin(username, password)
	}


	return (
		<div className={classes.fullScreenContainer}>
			<img
				src="/logo.webp"
				alt="Логотип"
			/>

			<Input
				error={usernameErrors[0]}
				value={username}
				setValue={(value) => {setUsername(value)}}
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

			<Button
				extraClasses={classes.inputField}
				black
				onClick={
					() => {
						onSubmit()
					}
				}
			>
				Вход
			</Button>

			<Link
				className={classes.goToText}
				to="/registration"
			>
				Нет аккаунта? <div>Регистрация</div>
			</Link>

			<Modal
				active={loginError !== null}
				onClose={() => {
					resetLoginError()
				}}
			>
				<Attention
					header={"Произошла ошибка"}
					message={loginError!}
					onClick={
						() => {
							resetLoginError()
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

