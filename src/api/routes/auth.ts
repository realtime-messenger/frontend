import axios from "axios";
import {API_HOST} from "../../config";
import {getRefreshToken} from "../../utils/localStorageManager";
import { JwtResponse } from "../../types/schemas/auth";


export const signinRequest = async (
	firstName: string,
	lastName: string,
	middleName: string,
	username: string,
	password: string
): Promise<JwtResponse> => {

	const data = {
		firstName: firstName,
		lastName: lastName,
		middleName: middleName,
		username: username,
		password: password
	}

	const response = await axios.post(
		API_HOST + "/api/v1/auth/registration",
		data
	)
	return response.data
}


export const loginRequest = async (
	username: string,
	password: string
): Promise<JwtResponse> => {

	const data = {
		username: username,
		password: password,
	}

	const response = await axios.post(
		API_HOST + "/api/v1/auth/login",
		data
	)
	return response.data
}

export const refreshRequest = async (): Promise<JwtResponse> => {
	const refreshToken = getRefreshToken()

	const data = {
		refreshToken: refreshToken
	}

	const response = await axios.post(
		API_HOST + "/api/v1/auth/refresh",
		data
	)
	return response.data
}