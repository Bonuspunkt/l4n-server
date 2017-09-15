import React, { PureComponent } from 'react';
import CsrfToken from './CsrfToken';
import Popup from './Popup';
import CommonMarkInput from './CommonMarkInput';

class LobbyAdmin extends PureComponent {
    constructor(...args) {
        super(...args);

        this.state = { show: true };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    render() {
        const { lobby, user } = this.props;

        if (lobby.userId !== user.id) {
            return null;
        }

        return (
            <div>
                {Array.from(this.renderButtons())}
                {this.renderPopup()}
            </div>
        );
    }

    *renderButtons(lobby) {
        const { state } = this.props.lobby;

        yield (
            <button key="1" type="button" disabled={state !== 1} onClick={this.handleShow}>
                launching server
            </button>
        );
        yield (
            <button key="2" type="button" disabled={state !== 2} onClick={this.handleShow}>
                server launched
            </button>
        );
    }

    renderPopup() {
        if (!this.state.show) return null;

        const { props } = this;
        const { lobby } = props;

        switch (lobby.state) {
            case 0:
            case 3:
                return null;
            case 1:
                return (
                    <Popup title="Min player conidition met" onClose={this.handleClose}>
                        Please confirm that you are ready to launch the server
                        <div>
                            <form action={`/lobby/${lobby.id}/changeState`} method="POST">
                                <CsrfToken {...props} />
                                <input type="hidden" name="" value="2" />
                                <button type="submit">confirm</button>
                            </form>
                            <button onClick={this.handleClose}>abort</button>
                        </div>
                    </Popup>
                );
            case 2:
                return (
                    <Popup title="Verify join information" onClose={this.handleClose}>
                        <form action={`/lobby/${lobby.id}`} method="POST">
                            <label className="formField">
                                <span className="formField-label">connect</span>
                                <CommonMarkInput
                                    className="formField-input"
                                    value={lobby.privateInfo}
                                />
                            </label>
                            <button type="submit">inform users</button>
                        </form>
                    </Popup>
                );
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
