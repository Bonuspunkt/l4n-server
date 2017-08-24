import React, { PureComponent } from 'react';

import CsrfToken from './CsrfToken';

const FormItem = props => (
    <label>
        <span>{ props.name }</span>
        <input name={ props.name } />
    </label>
);

class LobbyDefinition extends PureComponent {
    render() {
        const { props } = this;
        const { lobbyDefinition, children } = props;
        const formItems = lobbyDefinition.map(item => <FormItem {...item} />);

        return (
            <form>
                <CsrfToken { ...props } />
                { children }
                { formItems }
                <button type="submit">Create Lobby</button>
            </form>
        )
    }
}

export default LobbyDefinition;
