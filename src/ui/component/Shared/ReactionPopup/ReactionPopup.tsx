import {FC, useRef} from "react";
import classes from "./ReactionPopup.module.css";
import {useOutsideClick} from "../../../../hooks/useOutsideClick.ts";

interface ReactionPopupProps {
	onReactionChoose: (reaction: string) => void
	onClose: () => void
	x: number
	y: number
}

const ReactionPopup: FC<ReactionPopupProps> = (
	{
		onReactionChoose,
		onClose,
		x,
		y
	}
) => {

	const reactions: string[] = [
		"❤️",
		"👍",
		"🤦‍♂️",
		"😅",
		"👎",
		"😔"
	]

	const ref = useRef<null | HTMLDivElement>(null);

	useOutsideClick(ref.current, () => {
		onClose()
	});

	return (
		<div
			ref={ref}
			style={
				{
					left: x,
					top: y
				}
			}
			className={classes.reactionPopup}>
			{
				reactions.map(
					(reaction: string) => (
						<span
							onClick={
								() => onReactionChoose(reaction)
							}
							className={classes.reaction}>
							{reaction}
						</span>
					)
				)
			}
		</div>
	);
};

export default ReactionPopup;