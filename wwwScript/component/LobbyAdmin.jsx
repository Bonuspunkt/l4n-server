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

class LobbyAdmin extends PureComponent {
    constructor(...args) {
        super(...args);

        this.state = { show: false };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    render() {
        const { lobby, user = {} } = this.props;

        if (lobby.userId !== user.id) return null;

        return (
            <div className="inline">
                {Array.from(this.renderButtons())}
                {this.renderPopup()}
            </div>
        );
    }

    *renderButtons() {
        const { state } = this.props.lobby;

        yield (
            <button
                key="spawnServer"
                type="button"
                disabled={state !== STATE.WAITING}
                onClick={this.handleShow}
            >
                spawning server
            </button>
        );
        yield (
            <button
                key="serverSpawned"
                type="button"
                disabled={state !== STATE.LAUNCHING}
                onClick={this.handleShow}
            >
                server spawned
            </button>
        );
    }

    renderPopup() {
        if (!this.state.show) return null;

        const { props } = this;
        const { lobby } = props;

        switch (lobby.state) {
            case 0:
                return (
                    <Popup title="Min. player conidition met" onClose={this.handleClose}>
                        Please confirm that you are ready to launch the server
                        <div>
                            <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
                                <CsrfToken {...props} />
                                <input type="hidden" name="action" value="changeState" />
                                <input type="hidden" name="newState" value="1" />
                                <div className="buttonLine">
                                    <button type="submit">confirm</button>
                                    <button type="button" onClick={this.handleClose}>
                                        abort
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Popup>
                );

            case 1:
                return (
                    <Popup title="join information" onClose={this.handleClose}>
                        <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
                            <CsrfToken {...props} />
                            <input type="hidden" name="action" value="changeState" />
                            <input type="hidden" name="newState" value="2" />
                            <CommonMarkInput defaultValue={joinInfo} />
                            <div className="buttonLine">
                                <button type="submit">inform users</button>
                                <button type="button" onClick={this.handleClose}>
                                    abort
                                </button>
                            </div>
                        </form>
                    </Popup>
                );

            default:
                return null;
        }
    }

    handleShow() {
        this.setState({ show: true });
    }
    handleClose() {
        this.setState({ show: false });
    }
}

export default LobbyAdmin;
