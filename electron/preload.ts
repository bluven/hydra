import { ipcRenderer, contextBridge } from 'electron'
import type { User, BrowserActivity, handleBrowserActivity } from './browser'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  setBrowserPath: (path: string) => ipcRenderer.send('set-browser-path', path),
  getBrowserPath: () => ipcRenderer.invoke('get-browser-path'),
  testBrowserPath: () => ipcRenderer.invoke('test-browser-path'),
  getUsers: () => ipcRenderer.invoke('get-users'),
  getUser: (name: string) => ipcRenderer.invoke('get-user', name),
  addUser: (user: User) => ipcRenderer.send('add-user', user),
  deleteUser: (name: string) => ipcRenderer.send('delete-user', name),
  openBrowser: (name: string) => ipcRenderer.send('open-browser', name),
  closeBrowser: (name: string) => ipcRenderer.send('close-browser', name),
  onBrowserActivity: (cb: handleBrowserActivity) => ipcRenderer.on('browser-activity', cb),
  offAllBrowserActivity: () => ipcRenderer.removeAllListeners('browser-activity')
})
