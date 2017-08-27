require('tap').mochaGlobals();
const { expect } = require('chai');
const puppeteer = require('puppeteer');

describe('register/login/logout', () => {

    let browser;
    before(async () => {
        browser = await puppeteer.launch();
    });
    after(() => {
        browser.close();
    })

    const baseUrl = 'http://localhost:8080/';
    const registerUrl = `${ baseUrl }register`;
    const password = '123456';

    it('should work', async () => {
        const timestamp = Date.now();
        const username = `user-${ timestamp }`;

        const page = await browser.newPage();
        await page.goto(baseUrl);
        await page.click('a[href="/register"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}register`);

        await page.focus('input[name="username"');
        await page.type(username);
        await page.focus('input[name="password1"]');
        await page.type(password);
        await page.focus('input[name="password2"]');
        await page.type(password);
        await page.click('form[action="/register"] button[type="submit"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}registered`);

        await page.click('a[href="/login"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}login`);

        await page.focus('input[name="username"]');
        await page.type(username)
        await page.focus('input[name="password"]');
        await page.type(password)
        await page.click('form[action="/auth/local"] button[type="submit"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(baseUrl);

        await page.click('form[action="/logout"] button[type="submit"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(baseUrl);

        const registerEl = await page.$('a[href="/register"]');
        expect(registerEl).to.not.equal(null);

    });

    async function verifyError({ page, username, password1, password2, errorMessage }) {
        await page.goto(registerUrl);
        await page.focus('input[name="username"');
        if (username) { await page.type(username); }
        await page.focus('input[name="password1"]');
        if (password1) { await page.type(password); }
        await page.focus('input[name="password2"]');
        if (password2) { await page.type(password); }
        await page.click('form[action="/register"] button[type="submit"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}register`);
        const errorEl = await page.$('h4.error');
        const actualErrorMessage = await errorEl.evaluate((el) => el.textContent);
        expect(actualErrorMessage).to.equal(errorMessage);
    }

    it('should not allow duplicate username', async () => {
        const timestamp = Date.now();
        const username = `user-${ timestamp }`;

        const page = await browser.newPage();

        await page.goto(registerUrl);
        await page.focus('input[name="username"');
        await page.type(username);
        await page.focus('input[name="password1"]');
        await page.type(password);
        await page.focus('input[name="password2"]');
        await page.type(password);
        await page.click('form[action="/register"] button[type="submit"]');

        await page.waitForNavigation({ timeout: 1e3, waitUntil: 'load' });
        expect(page.url()).to.equal(`${baseUrl}registered`);

        await verifyError({ page, username,
            password1: password,
            password2: password,
            errorMessage: 'username already registered'
        });
    });

    it('should not allow empty username', async () => {

        const page = await browser.newPage();
        await verifyError({
            page,
            errorMessage: 'username is required'
        });
    });

    it('should not allow empty password', async () => {
        const timestamp = Date.now();
        const username = `user-${ timestamp }`;

        const page = await browser.newPage();
        await verifyError({
            page, username,
            errorMessage: 'password is required'
        });
    });

    it('should verify that both passwords match', async () => {
        const timestamp = Date.now();
        const username = `user-${ timestamp }`;

        const page = await browser.newPage();
        await verifyError({
            page, username, password1: password,
            errorMessage: 'passwords do not match'
        });
    });

});
