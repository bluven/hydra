import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, notification } from 'antd';
import "./index.less";
import UserList from './users/index'

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const BrowserConfigure = () => {
    const [notificationAPI, contextHolder] = notification.useNotification();
    const [browserPath, setBrowserPath] = useState('');
    const fileRef = useRef(null); 

    const onChange=(e: React.FormEvent<HTMLInputElement>) => {
        // setBrowserPath(e.target.value);
      const path = fileRef.current.files[0].path
      setBrowserPath(path);
      window.ipcRenderer.setBrowserPath(path);
    };

    const notify = (type: NotificationType, description: string) => {
      let title: string = 'Success';
      if (type == 'error') {
        title = 'Error'
      }

      notificationAPI[type]({
        message: title,
        description,
      });
    };

    useEffect(() => {
      window.ipcRenderer.getBrowserPath().then((path) => {
        setBrowserPath(path);
        console.log(path)
      });
    }, [])

    async function testBrowserIsConfigured() {
      const result: {ok: boolean, error: string} = await window.ipcRenderer.testBrowserPath()
      if (result.ok) {
        notify('success', 'Browser is correctly configured.')
      } else {
        notify('error', result.error)
      }
    }

    return (
      <div>
        {contextHolder}
        <div>
          <label className="browser-selector">
            Choose Browser:
            <input
            type="file"
            ref={fileRef}
            onChange={onChange}
            />
          </label>
          <span>{browserPath}</span>
        </div>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={testBrowserIsConfigured}>Test Browser Path</Button>
          <Button>Default Button</Button>
        </Flex>
        <div>
          <UserList/>
        </div>
      </div>
    );
}

export default BrowserConfigure;