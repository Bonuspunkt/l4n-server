import { Selector } from 'testcafe';

import header from './screen/component/header';
import register from './screen/register';
import login from './screen/login';

fixture('signup lifecycle');

test.page('http://localhost:8080/')('register/login/logout', async t => {
    const username = `user-${Date.now()}`;
    const password = 'password';

    await header.checkState({ loggedIn: false });

    await t.click(header.el.register);

    await register.fillRegister({
        username,
        password1: password,
        password2: password,
    });

    await header.checkState({ loggedIn: false });

    const successEl = Selector('h3');
    await t.expect(successEl.textContent).eql('Account successfully created');
    await t.click(header.el.login);

    await login.login({ username, password });

    await header.checkState({ loggedIn: true });
    await header.checkUser(username);

    await t.click(header.el.logout);

    await header.checkState({ loggedIn: false });
});

test.page('http://localhost:8080/register')('password must match', async t => {
    const username = `user-${Date.now()}`;

    await register.fillRegister({
        username,
        password1: 'a',
        password2: 'b',
    });

    await t.expect(register.el.error.exists).ok();
    await t.expect(register.el.error.textContent).eql('passwords do not match');
});
