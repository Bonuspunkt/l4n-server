import React, { PureComponent } from 'react';
import CsrfToken from './CsrfToken';
import Popup from './Popup';
import CommonMarkInput from './CommonMarkInput';

const STATE = {
    WAITING: 0,
    LAUNCHING: 1,
    OPEN: 2,
};

const joinInfo = `1. launch game
2. multiplayer
3. find "lobby"
4. password is "123456"`;

class SpawnedServerButton extends PureComponent {
    constructor(...args) {
        super(...args);

        this.state = {};

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    render() {
        const { lobby, user = {} } = this.props;
        const { state } = lobby;

        if (lobby.userId !== user.id) return null;

        return [
            <button
                key="serverSpawned"
                type="button"
                disabled={state !== STATE.LAUNCHING}
                onClick={this.handleShow}
            >
                server spawned
            </button>,
            this.renderPopup(),
        ];
    }

    renderPopup() {
        if (!this.state.show) return null;

        const { props } = this;
        const { lobby } = props;

        if (lobby.state !== STATE.LAUNCHING) return null;

        return (
            <Popup key="serverSpawnedPopup" title="join information" onClose={this.handleClose}>
                <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
                    <CsrfToken {...props} />
                    <input type="hidden" name="action" value="changeState" />
                    <input type="hidden" name="newState" value="2" />
                    <CommonMarkInput name="privateInfo" defaultValue={joinInfo} />
                    <div className="buttonLine">
                        <button type="submit">inform users</button>
                        <button type="button" onClick={this.handleClose}>
                            abort
                        </button>
                    </div>
                </form>
            </Popup>
        );
    }

    handleShow() {
        this.setState({ show: true });
    }
    handleClose() {
        this.setState({ show: false });
    }
}

export default SpawnedServerButton;
