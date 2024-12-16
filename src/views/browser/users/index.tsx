import React, { useState, useEffect } from 'react';
import { Space, Table, Badge, Button, message, Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import AddUser  from './addUser';
import type { BrowserActivity, User } from 'electron/browser';
import { IpcRendererEvent } from 'electron';

const BrowserStatus = (running: boolean) => {
  if (running) {
    return <Badge status='processing' color='green'/>
  } else {
    return <Badge status='default' color='red'/>
  }
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState([] as User[]);

  function loadUsers() {
    window.ipcRenderer.getUsers().then(users => {
      setUsers(users);
      console.log(users)
    })
  }

  const deleteUser = async function(username: string) {
    const user = users.find(u => u.name === username)
    if (user?.browserRunning) {
      message.error('This user has a browser running, you have to close the browser first')
      return
    }

    await window.ipcRenderer.deleteUser(username)
    loadUsers()
  }

  const openBrowser = async function(username: string){
    await window.ipcRenderer.openBrowser(username)
    loadUsers()
  }

  const closeBrowser = async function(username: string){
    await window.ipcRenderer.closeBrowser(username)
    loadUsers()
  }

  useEffect(() => {
    loadUsers(); 

    window.ipcRenderer.onBrowserActivity((_event: IpcRendererEvent, activity: BrowserActivity) => {
      console.log(activity)
      loadUsers()
    })

    return () => {
      window.ipcRenderer.offAllBrowserActivity() 
    };
  }, [])


  const columns: TableProps<User>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Browser Opened',
      dataIndex: 'browserRunning',
      key: 'browserRunning',
      render: (opened) => BrowserStatus(opened)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, user: User) => (
        <Space size="middle">
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this user?"
            onConfirm={() => deleteUser(user.name)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          {user.browserRunning ? 
            <Button danger onClick={() => closeBrowser(user.name)} loading={user.processing}>Close Browser</Button> : 
            <Button onClick={() => openBrowser(user.name)} loading={user.processing}>Open Browser</Button>
          }
        </Space>
      ),
    },
  ];

  return (
      <>
        <Space style={{float: 'right'}}>
          <AddUser onCreateUser={loadUsers}/>
        </Space>
        <Table<User> columns={columns} dataSource={users} />
      </>
  )
}

export default  UserList