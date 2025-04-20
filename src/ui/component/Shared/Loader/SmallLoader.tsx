import classes from "./SmallLoader.module.css"
import {FC} from "react";


interface SmallLoaderProps {
	active: boolean;
}

const SmallLoader: FC<SmallLoaderProps> = (
	{
		active
	}
) => {

	const getClasses = () => {
		let result = [classes.container]
		if (!active) result.push(classes.hidden)
		return result.join(" ")
	}

	return (
		<div className={getClasses()}>
			<div className={classes.text}>
				Загрузка...
			</div>
			<div className={classes.loader}>
				<div className={[classes.square].join(" ")}></div>
				<div className={[classes.square].join(" ")}></div>
				<div className={[classes.square, classes.last].join(" ")}></div>
				<div className={[classes.square, classes.clear].join(" ")}></div>
				<div className={[classes.square].join(" ")}></div>
				<div className={[classes.square, classes.last].join(" ")}></div>
				<div className={[classes.square, classes.clear].join(" ")}></div>
				<div className={[classes.square].join(" ")}></div>
				<div className={[classes.square, classes.last].join(" ")}></div>
			</div>
		</div>
	);
};

export default SmallLoader;