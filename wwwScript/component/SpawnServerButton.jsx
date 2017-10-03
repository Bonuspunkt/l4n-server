import React, { PureComponent } from 'react';
import CsrfToken from './CsrfToken';
import Popup from './Popup';

const STATE = {
    WAITING: 0,
    LAUNCHING: 1,
    OPEN: 2,
};

class SpawnServerButton extends PureComponent {
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
                key="spawnServer"
                type="button"
                disabled={state !== STATE.WAITING}
                onClick={this.handleShow}
            >
                spawning server
            </button>,
            this.renderPopup(),
        ];
    }

    renderPopup() {
        if (!this.state.show) return null;

        const { props } = this;
        const { lobby } = props;
        if (lobby.state !== STATE.WAITING) return null;

        return (
            <Popup
                key="spawnServerPopup"
                title="Min. player conidition met"
                onClose={this.handleClose}
            >
                <form className="inline" action={`/lobby/${lobby.id}`} method="POST">
                    Please confirm that you are ready to launch the server
                    <div className="popup-footer">
                        <CsrfToken {...props} />
                        <input type="hidden" name="action" value="changeState" />
                        <input type="hidden" name="newState" value="1" />
                        <button type="submit">confirm</button>
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

export default SpawnServerButton;
