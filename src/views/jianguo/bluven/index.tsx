import { useRef } from 'react'
import { Space, Button } from 'antd';
import { WebviewTag } from 'electron';

const JianGuoForBluven = () => {
	const webViewRef = useRef<WebviewTag>(null!); 

	const goDashboard = () => {
		webViewRef.current.loadURL('https://www.jianguoyun.com/d/home#/')
	}

	const goIndex = () => {
		webViewRef.current.loadURL('https://www.jianguoyun.com/')
	}

	return (
		<>
		  <Space>
			<Button onClick={goIndex}>Go Index</Button>
			<Button onClick={goDashboard}>Go Dashboard</Button>
		  </Space>
		  <webview 
			id="foo" src="https://www.jianguoyun.com/" 
			style={{
				display: "inline-flex", 
				width: "100%", 
				height: "100%"
			  }}
			partition="persistent:bluven"
			>
		  </webview>	
		</>
	);
}

export default JianGuoForBluven;