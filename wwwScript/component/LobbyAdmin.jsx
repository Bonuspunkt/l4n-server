import React, { PureComponent } from 'react';
import CsrfToken from './CsrfToken';
import Popup from './Popup';
import CommonMarkInput from './CommonMarkInput';

class LobbyAdmin extends PureComponent {
    constructor(...args) {
        super(...args);

        this.state = { show: true };
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { props } = this;
        const { lobby, user } = this.props;

        if (lobby.id !== user.id) return null;

        if (!this.state.show) return null;

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
                                <input type="hidden" value="2" />
                                <button type="submit">confirm</button>
                            </form>
                            <button onClick={this.handleClose}>abort</button>
                        </div>
                    </Popup>
                );
            case 2:
                return (
                    <Popup title="Verify join information" onClose={this.handleClose}>
                        <CommonMarkInput />
                    </Popup>
                );
        }
    }

    handleClose() {
        this.setState({ show: false });
    }
}

export default LobbyAdmin;
