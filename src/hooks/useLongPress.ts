import { useState, useRef } from 'react';

export default function useLongPress(callback: (e: MouseEvent) => void) {
	const [action, setAction] = useState<string>();

	// @ts-expect-error just ignore typing here
	const timerRef = useRef();
	// @ts-expect-error just ignore typing here
	const isLongPress = useRef();

	function startPressTimer() {
		isLongPress.current = false;
		timerRef.current = setTimeout(() => {
			isLongPress.current = true;
			setAction('longpress');
		}, 500)
	}

	function handleOnClick(e: MouseEvent) {
		if ( isLongPress.current ) {
			if (callback !== undefined && callback !== null) {
				callback(e)
			}
			return;
		}
		setAction('click')
	}

	function handleOnMouseDown() {
		startPressTimer();
	}

	function handleOnMouseUp() {
		// @ts-expect-error just ignore typing here
		clearTimeout(timerRef.current);
	}

	function handleOnTouchStart() {
		startPressTimer();
	}

	function handleOnTouchEnd() {
		if ( action === 'longpress' ) return;
		// @ts-expect-error just ignore typing here
		clearTimeout(timerRef.current);
	}

	return {
		action,
		handlers: {
			onClick: handleOnClick,
			onMouseDown: handleOnMouseDown,
			onMouseUp: handleOnMouseUp,
			onTouchStart: handleOnTouchStart,
			onTouchEnd: handleOnTouchEnd
		}
	}
}