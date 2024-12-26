import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 外部链接模块
const linkRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "WebView Test"
		},
		children: [
			{
				path: "/jianguo/bluven",
				element: lazyLoad(React.lazy(() => import("@/views/jianguo/bluven/index"))),
				meta: {
					requiresAuth: false,
					title: "JianGuo For Bluven",
					key: "jianguo-bluven"
				}
			},
            {
				path: "/jianguo/yan",
				element: lazyLoad(React.lazy(() => import("@/views/jianguo/yan/index"))),
				meta: {
					requiresAuth: false,
					title: "JianGuo For Yan",
					key: "jianguo-yan"
				}
			}
		]
	}
];

export default linkRouter;
