import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 表单 Form 模块
const routers: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "Browser Configuration"
		},
		children: [
			{
				path: "/browser-configure",
				element: lazyLoad(React.lazy(() => import("@/views/browserConfig/index"))),
				meta: {
					requiresAuth: false,
					title: "Browser Configuration",
					key: "browser-config"
				}
			},
		]
	}
];

export default routers;
