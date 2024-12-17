import puppeteer, { Browser } from 'puppeteer';
import { ipcMain, IpcRendererEvent } from 'electron'
import settings from './settings'
import path from 'node:path';
import fs from 'node:fs';
// import utils from '@shared/utils'

import {APP_FOLDER_PATH, initAppFolder} from './appData'

const USERS_FILE_PATH = path.join(APP_FOLDER_PATH, 'Users.json')
const USER_DATA_DIR = path.join(APP_FOLDER_PATH, 'userData')

export interface User {
    name: string,
    description?: string,
    processing?: true|false,
    browserRunning?: boolean,
    browser?: Browser,
}

export type BrowserActivity = {
    username: string,
    type: 'open' | 'close',
}

export type handleBrowserActivity = (event: IpcRendererEvent, activity: BrowserActivity) => void

const USERS: User[] = [];

async function testBrowserIsConfigured(): Promise<void> {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath: settings.getBrowserPath(),
        args: [
            '--start-maximized' // you can also use '--start-fullscreen'
        ]
    });

    await browser.close();
}

function init() {
    initAppFolder()

    if (!fs.existsSync(USERS_FILE_PATH)) {
        fs.writeFileSync(USERS_FILE_PATH, '[]', {flush: true})
    }
}

function loadUsers() {
    init()

    const data = fs.readFileSync(USERS_FILE_PATH)
    const users = JSON.parse(data.toString()) as User[]
    users.forEach(user => {
        USERS.push({...user})
    })
}

function saveUsers() {
    const users = USERS.map(u => ({ name: u.name, description: u.description }));
    const data = JSON.stringify(users)
    fs.writeFileSync(USERS_FILE_PATH, data, {flush: true})
}

function getUsers(): User[] {
    return USERS.map(u => ({ 
        name: u.name, 
        description: u.description, 
        processing: u.processing,
        browserRunning: u.browser !== undefined 
    }));
}

function getUser(name: string): User|undefined {
    return USERS.find(u => u.name == name)
}

function addUser(user: User) {
    // This regex matches letters (both uppercase and lowercase), numbers, and Chinese characters
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(user.name)) {
        throw new Error('Only chinese character, number and letters are allowed')
    }

    if (USERS.some(u => u.name === user.name)) {
        throw new Error('This user has already existed');
    }

    USERS.push(user)
    saveUsers()
}

function deleteUser(name: string) {
    const i = USERS.findIndex(u => u.name == name)
    if (i < 0) {
        return
    }

    USERS.splice(i, 1);
    saveUsers()
}

async function openBrowser(username:string, onClose?: () => void|undefined) {
    const user = getUser(username);
    if(user === undefined) {
        throw Error("User doesn't exist")
    }

    if (user?.browser !== undefined) {
        throw Error('This user alread has a browser opened')
    }

    try {
        user.processing = true

        const userDataPath = path.join(USER_DATA_DIR, username)
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            executablePath: settings.getBrowserPath(),
            args: [
              '--start-maximized',
              `--user-data-dir=${userDataPath}`,
            ]
        });

        user.browser = browser
        if (onClose) {
            browser.once('disconnected', onClose)
        }
    } finally {
        user.processing = false
    }
    
}

async function closeBrowser(username:string) {
    const user = getUser(username);
    if(user === undefined) {
        throw Error("User doesn't exist")
    }

    if (user.browser === undefined) {
        throw Error('This user has no browser opened')
    }

    try {
        user.processing = true
        await user.browser.close()
        user.browser = undefined
    } finally {
        user.processing = false
    }
}

function registerIpcListeners() {
  ipcMain.handle('get-users', ()=> {
    return getUsers()
  })


  ipcMain.handle('get-user', (_event, name)=> {
    return getUser(name)
  })

  ipcMain.on('add-user', (_event, user: User)=> {
    addUser(user)
  })

  ipcMain.on('delete-user', (_event, name)=> {
    deleteUser(name)
  })

  ipcMain.on('open-browser', async (event, username)=> {
    await openBrowser(username, ()=> {
        const user = getUser(username)
        if(user) {
            user.browser = undefined
            event.reply('browser-activity', { username, type: 'close'} as BrowserActivity)
        }
    })
    event.reply('browser-activity', { username, type: 'open'} as BrowserActivity)
  })

  ipcMain.on('close-browser', async (event, username)=> {
    await closeBrowser(username)
    event.reply('browser-activity', { username, type: 'close'} as BrowserActivity)
  })

  ipcMain.handle('test-browser-path', async ()=> {
    let result: {ok: boolean, error: string} = { ok: false, error: ''};
    try {
      await testBrowserIsConfigured()
      result.ok = true
    } catch(e) {
    //   result.error = utils.getErrorMessage(e)
    }

    return result
  })
}

export default {
    loadUsers,
    testBrowserIsConfigured,
    registerIpcListeners,
    getUsers,
    getUser,
    addUser,
    deleteUser,
    openBrowser,
    closeBrowser,
}