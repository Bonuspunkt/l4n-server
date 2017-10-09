import { Selector, t } from 'testcafe';

const gameEl = Selector('.lobbyHeader h2');
const modeEl = Selector('.lobbyHeader h3');
const lobbyEl = Selector('.lobbyHeader h1');

const statusEl = Selector('input[name="status"]');
const playersEl = Selector('input[name="players"]');

const joinEl = Selector('button[data-action="join"]');
const leaveEl = Selector('button[data-action="leave"]');

const destroyEl = Selector('button[data-action="destroy"]');
const spawnServerEl = Selector('button[data-action="spawnServer"]');
const serverReadyEl = Selector('button[data-action="serverReady"]');

const lobbyUserItemEl = Selector('.lobbyUsers .userDisplay');
const privateInfoEl = Selector('.privateInfo');

const popupPrivateInfoEl = Selector('.popup [name="privateInfo"]');
const popupSubmitEl = Selector('.popup [type="submit"]');

const lobby = {
    get el() {
        return {
            get game() {
                return gameEl;
            },
            get mode() {
                return modeEl;
            },
            get lobby() {
                return lobbyEl;
            },
            get status() {
                return statusEl;
            },
            get players() {
                return playersEl;
            },
            // admin
            get destroy() {
                return destroyEl;
            },
            get spawnServer() {
                return spawnServerEl;
            },
            get serverReady() {
                return serverReadyEl;
            },
            // user
            get join() {
                return joinEl;
            },
            get leave() {
                return leaveEl;
            },

            get privateInfo() {
                return privateInfoEl;
            },

            get lobbyUserItem() {
                return lobbyUserItemEl;
            },

            // popup
            get popup() {
                return {
                    get privateInfo() {
                        return popupPrivateInfoEl;
                    },
                    get submit() {
                        return popupSubmitEl;
                    },
                };
            },
        };
    },

    async serverReadyPopup({ privateInfo }) {
        if (privateInfo) {
            await t.typeText(popupPrivateInfoEl, 'test private info', { replace: true });
        }
        await t.click(popupSubmitEl);
    },
};

export default lobby;
