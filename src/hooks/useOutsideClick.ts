import {useEffect} from "react";

export function useOutsideClick(ref: any, onClickOut: () => void, deps = []){
	useEffect(() => {
		const onClick = ({target}: any) => !ref?.contains(target) && onClickOut?.()
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, deps);
}



export function useOutsideRightClick(ref: any, onClickOut: () => void, deps = []){
	useEffect(() => {
		const onClick = ({target}: any) => !ref?.contains(target) && onClickOut?.()
		document.addEventListener("contextmenu", onClick);
		return () => document.removeEventListener("contextmenu", onClick);
	}, deps);
}
