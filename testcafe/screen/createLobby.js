import { Selector, t } from 'testcafe';

const gameInput = Selector('input[name="game"]');
const modeInput = Selector('input[name="mode"]');
const lobbyInput = Selector('input[name="name"]');
const minPlayersInput = Selector('input[name="minPlayers"]');
const maxPlayersInput = Selector('input[name="maxPlayers"]');
const publicInfoInput = Selector('input[name="publicInfo"]');
const submitButton = Selector('form[action="/lobby"] button[type="submit"]');

const createLobby = {
    async create({ game, mode, lobby, minPlayers, maxPlayers, publicInfo }) {
        if (game) {
            await t.typeText(gameInput, game);
        }
        if (mode) {
            await t.typeText(modeInput, mode);
        }
        if (lobby) {
            await t.typeText(lobbyInput, lobby);
        }
        if (minPlayers) {
            await t.typeText(minPlayersInput, String(minPlayers));
        }
        if (maxPlayers) {
            await t.typeText(maxPlayersInput, String(maxPlayers));
        }
        if (publicInfo) {
            await t.typeText(publicInfoInput, publicInfo, { replace: true });
        }
        await t.click(submitButton);
    },
};

export default createLobby;
