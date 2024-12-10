import puppeteer from 'puppeteer';
import settings from './settings'

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

export default {
    testBrowserIsConfigured,
}