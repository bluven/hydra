import fs from 'node:fs';
import path from 'node:path';
import { ipcMain } from 'electron'
import {APP_FOLDER_PATH, initAppFolder} from './appData'

type Settings = {[key: string]: any}

const SETTINGS_PATH = path.join(APP_FOLDER_PATH, 'Settings.json')
const SETTINGS: Settings = {} 

function init() {
    initAppFolder()
    if (!fs.existsSync(SETTINGS_PATH)) {
        fs.writeFileSync(SETTINGS_PATH, '{}', {flush: true})
    }
}

function load() {
    init()

    const data = fs.readFileSync(SETTINGS_PATH)
    const tmp = JSON.parse(data.toString())
    Object.assign(SETTINGS, tmp)
}

function registerIpcListeners() {
    ipcMain.on('set-browser-path', (_event, filepath: string) => {
    console.log(`Title: ${filepath}`)
    setBrowserPath(filepath)
  })

  ipcMain.handle('get-browser-path', ()=> {
    console.log('Get browser path', getBrowserPath)
    return getBrowserPath()
  })
}

function getValue(key: string): any {
    return SETTINGS[key]
}

function setValue(key: string, value: any) {
    SETTINGS[key] = value

    const data = JSON.stringify(SETTINGS)
    fs.writeFileSync(SETTINGS_PATH, data, {flush: true})
}

function getBrowserPath(): string {
    return getValue('browserPath') as string
}

function setBrowserPath(value: string) {
    return setValue('browserPath', value)
}

export default {
    load,
    registerIpcListeners,
    getBrowserPath,
}