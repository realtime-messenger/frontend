import React, {FC, ReactNode} from 'react';
import classes from "./Modal.module.css";

interface ModalProps {
	children: ReactNode
	active: boolean
	onClose: () => void
}


const Modal: FC<ModalProps> = (
	{
		children,
		active=false,
		onClose
	}
) => {

	const onClickOutside = () => {
		onClose()
	}

	return (
		<>
			{
				active && (
					<div
						className={classes.dimmer}
						onClick={onClickOutside}
					>
						<div
							className={classes.container}
							onClick={(e) => e.stopPropagation()}
						>
							{children}
						</div>

					</div>
				)
			}
		</>
	);
};

export default Modal;