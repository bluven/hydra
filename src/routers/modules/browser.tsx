import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 表单 Form 模块
const routers: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "Browser Management"
		},
		children: [
			{
				path: "/browser",
				element: lazyLoad(React.lazy(() => import("@/views/browser/index"))),
				meta: {
					requiresAuth: false,
					title: "Browser Management",
					key: "browser-management"
				}
			},
		]
	}
];

export default routers;
