import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron'

type Settings = {[key: string]: any}

const SETTINGS: Settings = {} 

const APP_PATH = app.getPath('userData')
const APP_FOLDER_PATH = path.join(APP_PATH, 'Application')
const SETTINGS_PATH = path.join(APP_FOLDER_PATH, 'Settings.json')

function init() {
    if (!fs.existsSync(APP_FOLDER_PATH)) {
        fs.mkdirSync(APP_FOLDER_PATH, {recursive: true})
    }

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

function getValue(key: string): any {
    return SETTINGS[key]
}

function setValue(key: string, value: any) {
    SETTINGS[key] = value

    const data = JSON.stringify(SETTINGS)
    fs.writeFileSync(SETTINGS_PATH, data, {flush: true})
}

export default {
    load,
    getValue,
    setValue
}