const ru = new Map();

ru.set(
	"Bad request",
	'Неверный запрос'
)

ru.set(
	"Invalid email or password",
	'Неверный логин или пароль'
)

ru.set(
	"You already applied for this course",
	'Вы уже учитесь на этом курсе'
)

ru.set(
	"Course not found",
	'Курс не найден'
)

ru.set(
	"Test not found",
	'Тест не найден'
)

export const ruLocale = (e: string): string => {
	if (ru.has(e)) {
		return ru.get(e)
	}
	return e
}