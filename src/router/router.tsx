import {Navigate} from "react-router-dom";
import {PLogin} from "../ui/layout/shared/PLogin/PLogin.tsx";
import {PRegistration} from "../ui/layout/shared/PRegistration/PRegistration.tsx";
import PChat from "../ui/layout/desktop/PChat/PChat.tsx";

export const loggedInDesktopRoutes = [
	{
		path: "/chat",
		element: (<PChat/>)
	},
	{
		path: "/*",
		element: (<Navigate to="/chat" replace={true}/>)
	}
]

export const loggedOutDesktopRoutes = [
	{
		path: "/login",
		element: (<PLogin/>)
	},
	{
		path: "/registration",
		element: (<PRegistration/>)
	},
	{
		path: "/*",
		element: (<Navigate to="/login" replace={true}/>)
	}
]

export const loggedInMobileRoutes = [
	// {
	// 	path: "/courses/all",
	// 	element: (<PAllCourses/>)
	// },
	// {
	// 	path: "/*",
	// 	element: (<Navigate to="/courses/all" replace={true}/>)
	// }
]


export const loggedOutMobileRoutes = [
	{
		path: "/login",
		element: (<PLogin/>)
	},
	{
		path: "/registration",
		element: (<PRegistration/>)
	},
	{
		path: "/*",
		element: (<Navigate to="/login" replace={true}/>)
	}
]