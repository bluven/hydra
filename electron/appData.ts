import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron'

export const APP_PATH = app.getPath('userData')
export const APP_FOLDER_PATH = path.join(APP_PATH, 'Application')

export function initAppFolder() {
    if (!fs.existsSync(APP_FOLDER_PATH)) {
        fs.mkdirSync(APP_FOLDER_PATH, {recursive: true})
    }
}
