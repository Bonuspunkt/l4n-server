require('tap').mochaGlobals();
const { expect } = require('chai');
const puppeteer = require('puppeteer');

const fillLogin = require('./prefab/fillLogin');
const fillRegistration = require('./prefab/fillRegistration');

describe('register/login/logout', () => {
    let browser;
    before(async () => {
        const options = {
            //headless: false
        };
        browser = await puppeteer.launch(options);
    });
    after(() => {
        browser.close();
    });

    const baseUrl = 'http://localhost:8080/';
    const registerUrl = `${baseUrl}register`;
    const password = '123456';
    const timeout = 1e3;

    it('should work', async () => {
        const timestamp = Date.now();
        const username = `user-${timestamp}`;

        const page = await browser.newPage();
        await page.goto(baseUrl);
        await page.click('a[href="/register"]');

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}register`);

        await fillRegistration({
            page,
            username,
            password1: password,
            password2: password,
        });

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}registered`);

        await page.click('a[href="/login"]');

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}login`);

        await fillLogin({ page, username, password });

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(baseUrl);

        await page.click('form[action="/logout"] button[type="submit"]');

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(baseUrl);

        const registerEl = await page.$('a[href="/register"]');
        expect(registerEl).to.not.equal(null);

        await page.close();
    });

    async function verifyRegistrationError({ page, username, password1, password2, errorMessage }) {
        await page.goto(registerUrl);

        await fillRegistration({ page, username, password1, password2 });

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(registerUrl);
        const actualErrorMessage = await page.evaluate(`document.querySelector('h4.error').textContent`);
        expect(actualErrorMessage).to.equal(errorMessage);
    }

    it('should not allow duplicate username', async () => {
        const timestamp = Date.now();
        const username = `user-${timestamp}`;

        const page = await browser.newPage();

        await page.goto(registerUrl);

        await fillRegistration({
            page,
            username,
            password1: password,
            password2: password,
        });

        await page.waitForNavigation({ timeout, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}registered`);

        await verifyRegistrationError({
            page,
            registerUrl,
            username,
            password1: password,
            password2: password,
            errorMessage: 'username already registered',
        });

        await page.close();
    });

    it('should not allow empty username', async () => {
        const page = await browser.newPage();
        await verifyRegistrationError({
            page,
            registerUrl,
            errorMessage: 'username is required',
        });

        await page.close();
    });

    it('should not allow empty password', async () => {
        const timestamp = Date.now();
        const username = `user-${timestamp}`;

        const page = await browser.newPage();
        await verifyRegistrationError({
            page,
            registerUrl,
            username,
            errorMessage: 'password is required',
        });

        await page.close();
    });

    it('should verify that both passwords match', async () => {
        const timestamp = Date.now();
        const username = `user-${timestamp}`;

        const page = await browser.newPage();
        await verifyRegistrationError({
            page,
            registerUrl,
            username,
            password1: password,
            errorMessage: 'passwords do not match',
        });

        await page.close();
    });
});
