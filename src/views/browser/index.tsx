import { useState, useRef, useEffect } from 'react';
import { Button, Divider, message } from 'antd';
import "./index.less";
import UserList from './users/index'

const BrowserConfigure = () => {
    const [browserPath, setBrowserPath] = useState('');
    const fileRef = useRef<HTMLInputElement>(null!); 
   
    const onChange=() => {
      const path = fileRef.current.files?.[0].path ?? '';
      setBrowserPath(path);
      window.ipcRenderer.setBrowserPath(path);
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
        message.success('Browser is correctly configured.')
      } else {
        message.error(result.error)
      }
    }

    return (
      <>
        <div>
          <label className="browser-selector">
            Choose Browser:
            <input
            type="file"
            ref={fileRef}
            onChange={onChange}
            />
          </label>
          <span className='browser-path'>{browserPath}</span>
          {  browserPath != null && <Button onClick={testBrowserIsConfigured}>Test Browser Path</Button>}
        </div>
        <Divider/>
        <div>
          <UserList/>
        </div>
      </>
    );
}

export default BrowserConfigure;