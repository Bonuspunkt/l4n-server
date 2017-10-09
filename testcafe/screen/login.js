import { Selector, t } from 'testcafe';

const usernameInput = Selector('input[name="username"]');
const passwordInput = Selector('input[name="password"]');
const submitButton = Selector('form[action="/login"] button[type="submit"]');

const login = {
    async fillLogin({ username, password }) {
        if (username) {
            await t.typeText(usernameInput, username);
        }
        if (password) {
            await t.typeText(passwordInput, password);
        }
        await t.click(submitButton);
    },

    async login(options) {
        await t.navigateTo('http://localhost:8080/login');
        await this.fillLogin(options);
    },
};

export default login;
