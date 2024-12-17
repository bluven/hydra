import { Navigate, useRoutes } from "react-router-dom";
import { RouteObject, RouteArray } from "@/routers/interface";
import Login from "@/views/login/index";

interface RouteModule {
	default: RouteArray,
}

// * 导入所有router
const metaRouters = import.meta.glob<RouteModule>("./modules/*.tsx", { eager: true });

export const routerArray = Object.values(metaRouters).map(mod => mod.default).flat()
export const rootRouter: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/login" />
	},
	{
		path: "/login",
		element: <Login />,
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	},
	...routerArray,
	{
		path: "*",
		element: <Navigate to="/404" />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;
