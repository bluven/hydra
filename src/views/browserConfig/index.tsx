import React, { useState, useRef, useEffect } from 'react';
import "./index.less";

const BrowserConfigure = () => {
    const [browserPath, setBrowserPath] = useState('');
    const fileRef = useRef(null); 

    const onChange=(e: React.FormEvent<HTMLInputElement>) => {
        // setBrowserPath(e.target.value);
      const path = fileRef.current.files[0].path
      setBrowserPath(path);
      window.ipcRenderer.setBrowserPath(path);
    };

    useEffect(() => {
      window.ipcRenderer.getBrowserPath().then((path) => {
        setBrowserPath(path);
        console.log(path)
      });
    }, [])

    return (
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
    );
}

export default BrowserConfigure;