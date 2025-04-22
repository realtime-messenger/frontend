import React from 'react';
import classes from "./AvatarPlaceholder.module.css";


interface AvatarPlaceholderProps {
	firstName?: string
	lastName?: string
	title?: string
}

const AvatarPlaceholder: FC<AvatarPlaceholderProps> = (
	{
		firstName,
		lastName,
		title
	}
) => {

	const getText = () => {
		if (title !== undefined) {
			return title[0].toUpperCase()
		}
		else {
			return (firstName[0] + lastName[0]).toUpperCase();
		}
	}

	return (
		<div className={classes.avatarPlaceholder}>
			{getText()}
		</div>
	)

}

export default AvatarPlaceholder;