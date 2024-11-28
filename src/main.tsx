// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import "@/styles/reset.less";
// import "antd/dist/reset.less";
import "@/assets/iconfont/iconfont.less";
import "@/styles/common.less";
// import "@/language/index";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux";
import App from "@/App";

// react 17 创建，控制台会报错，暂时不影响使用（菜单折叠时不会出现闪烁）
// ReactDOM.render(
// 	// * react严格模式
// 	// <React.StrictMode>
// 	<Provider store={store}>
// 		<PersistGate persistor={persistor}>
// 			<App />
// 		</PersistGate>
// 	</Provider>,
// 	// </React.StrictMode>,
// 	document.getElementById("root")
// );


// react 18 创建（会导致 antd 菜单折叠时闪烁，等待官方修复）
ReactDOM.createRoot(document.getElementById("root")!).render(
	// * react严格模式
	// <React.StrictMode>
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
	// </React.StrictMode>
);


// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})