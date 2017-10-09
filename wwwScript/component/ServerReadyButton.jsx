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
4. password is \`123456\``;

class ServerReadyButton extends PureComponent {
    constructor(props, ...args) {
        super(props, ...args);

        this.state = {};

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    render() {
        const { lobby, user = {} } = this.props;

        if (lobby.userId !== user.id) return null;

        return [this.renderButton(), this.renderPopup()];
    }

    renderButton() {
        const { props } = this;
        const { lobby: { id, state } } = props;
        const disabled = state !== STATE.LAUNCHING;

        if (process.env.BROWSER) {
            return (
                <button
                    key="serverReady"
                    type="button"
                    data-action="serverReady"
                    disabled={disabled}
                    onClick={this.handleShow}
                >
                    server ready
                </button>
            );
        }

        return (
            <form className="inline" action={`/lobby/${id}`} method="POST">
                <CsrfToken {...props} />
                <input type="hidden" name="popup" value="serverReady" />
                <button type="submit" data-action="serverReady" disabled={disabled}>
                    server ready
                </button>
            </form>
        );
    }

    renderPopup() {
        if (process.env.BROWSER && !this.state.show) return null;
        if (!process.env.BROWSER && this.props.popup !== 'serverReady') return null;

        const { props } = this;
        const { lobby } = props;

        if (lobby.state !== STATE.LAUNCHING) return null;

        const abortButton = process.env.BROWSER ? (
            <button type="button" onClick={this.handleClose}>
                abort
            </button>
        ) : (
            <a className="button" href={`/lobby/${lobby.id}`}>
                abort
            </a>
        );

        return (
            <Popup key="serverReadyPopup" title="join information" onClose={this.handleClose}>
                <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
                    <CsrfToken {...props} />
                    <input type="hidden" name="action" value="changeState" />
                    <input type="hidden" name="newState" value="2" />
                    <CommonMarkInput name="privateInfo" defaultValue={joinInfo} />
                    <div className="buttonLine">
                        <button type="submit">inform users</button>
                        {abortButton}
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

export default ServerReadyButton;
