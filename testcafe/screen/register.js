import { Selector, t } from 'testcafe';

const usernameInput = Selector('input[name="username"]');
const password1Input = Selector('input[name="password1"]');
const password2Input = Selector('input[name="password2"]');
const submitButton = Selector('form[action="/register"] button[type="submit"]');

const errorEl = Selector('h4.error');

const register = {
    get el() {
        return {
            get error() {
                return errorEl;
            },
        };
    },

    async fillRegister({ username, password, password1, password2 }) {
        if (password) {
            password1 = password;
            password2 = password;
        }

        if (username) {
            await t.typeText(usernameInput, username);
        }
        if (password1) {
            await t.typeText(password1Input, password1);
        }
        if (password2) {
            await t.typeText(password2Input, password2);
        }
        await t.click(submitButton);
    },

    async register(options) {
        await t.navigateTo('http://localhost:8080/register');
        await this.fillRegister(options);
        // check result?
    },
};

export default register;
