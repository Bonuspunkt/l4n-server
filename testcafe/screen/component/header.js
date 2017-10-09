import { Selector, t } from 'testcafe';

const rootLink = Selector('header .header-left a');

const loginLink = Selector('header .header-right a[href="/login"]');
const registerLink = Selector('header .header-right a[href="/register"]');

const userLink = Selector('header .header-right a.userDisplay');
const logoutButton = Selector('header .header-right form button[type="submit"]');

const header = {
    get el() {
        return {
            get root() {
                return rootLink;
            },
            get login() {
                return loginLink;
            },
            get register() {
                return registerLink;
            },
            get user() {
                return userLink;
            },
            get logout() {
                return logoutButton;
            },
        };
    },

    async checkState({ loggedIn }) {
        await t.expect(loginLink.exists)[loggedIn ? 'notOk' : 'ok']();
        await t.expect(registerLink.exists)[loggedIn ? 'notOk' : 'ok']();

        await t.expect(userLink.exists)[loggedIn ? 'ok' : 'notOk']();
        await t.expect(logoutButton.exists)[loggedIn ? 'ok' : 'notOk']();
    },

    async checkUser(username) {
        await t.expect(userLink.textContent).eql(username);
    },

    async logout() {
        await t.click(logoutButton);
    },
};

export default header;
