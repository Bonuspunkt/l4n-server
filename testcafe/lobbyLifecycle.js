import { Selector, ClientFunction } from 'testcafe';

import header from './screen/component/Header';
import register from './screen/Register';
import login from './screen/Login';
import createLobby from './screen/CreateLobby';
import lobby from './screen/Lobby';

const getPathname = ClientFunction(() => window.location.pathname);

fixture('lobby lifecycle');

test.before(async t => {
    const username = `user-${Date.now()}`;
    const password = 'password';

    await register.register({ username, password });

    t.ctx = { ...t.ctx, username, password };
})('main page should have link to create lobby', async t => {
    const { username, password } = t.ctx;
    await login.login({ username, password });

    const createLobbyEl = Selector('a[href="/lobby"]');
    await t.expect(createLobbyEl.exists).ok();
});

test.before(async t => {
    const username = `user-${Date.now()}`;
    const user1 = `${username}_1`;
    const user2 = `${username}_2`;
    const password = 'password';

    await register.register({ username: user1, password });
    await register.register({ username: user2, password });

    t.ctx = { ...t.ctx, user1, user2, password };
})('lobby lifecycle', async t => {
    const { user1, user2, password } = t.ctx;

    await login.login({ username: user1, password });

    const createLobbyEl = Selector('a[href="/lobby"]');
    await t.click(createLobbyEl);

    await createLobby.create({
        game: 'test game',
        mode: 'test mode',
        lobby: 'test lobby',
        minPlayers: 1,
        maxPlayers: 2,
    });

    const pathname = await getPathname();

    await t.expect(lobby.el.destroy.exists).ok();
    await t.expect(lobby.el.spawnServer.hasAttribute('disabled')).notOk();
    await t.expect(lobby.el.serverReady.hasAttribute('disabled')).ok();
    await t.expect(lobby.el.status.value).eql('waiting');
    await t.expect(lobby.el.lobbyUserItem.withText(user1).exists).ok();
    await t.expect(lobby.el.lobbyUserItem.withText(user2).count).eql(0);

    await t.click(lobby.el.spawnServer);

    await t.expect(lobby.el.destroy.exists).ok();
    await t.expect(lobby.el.spawnServer.hasAttribute('disabled')).ok();
    await t.expect(lobby.el.serverReady.hasAttribute('disabled')).notOk();
    await t.expect(lobby.el.status.value).eql('launching');

    await t.click(lobby.el.serverReady);

    await lobby.serverReadyPopup({ privateInfo: 'test private info' });

    await t.expect(lobby.el.destroy.exists).ok();
    await t.expect(lobby.el.spawnServer.hasAttribute('disabled')).ok();
    await t.expect(lobby.el.serverReady.hasAttribute('disabled')).ok();
    await t.expect(lobby.el.status.value).eql('running');

    await header.logout();
    await login.login({ username: user2, password });

    await t.navigateTo('http://localhost:8080');

    const lobbyLinkEl = Selector(`a[href="${pathname}"]`);
    await t.click(lobbyLinkEl);

    await t.click(lobby.el.join);

    await t.expect(lobby.el.lobbyUserItem.withText(user1).exists).ok();
    await t.expect(lobby.el.lobbyUserItem.withText(user2).exists).ok();

    await t.expect(lobby.el.privateInfo.exists).ok();

    await t.click(lobby.el.leave);

    await header.logout();
    await login.login({ username: user1, password });

    await t.click(lobbyLinkEl);

    await t.expect(lobby.el.lobbyUserItem.withText(user1).exists).ok();
    await t.expect(lobby.el.lobbyUserItem.withText(user2).count).eql(0);

    await t.click(lobby.el.destroy);
});
