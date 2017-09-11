import React, { PureComponent } from 'react';

import CsrfToken from './CsrfToken';

const FormInput = props => {
    switch (props.type) {
        case 'string':
            return <input type="text" name={props.name} />;
        case 'number':
            return <input type="number" name={props.name} />;
        case 'select':
            const options = props.values.map(value => (
                <option key={value.name}>{value.name}</option>
            ));
            return <select name={props.name}>{options}</select>;
    }
};

const FormItem = props => (
    <label>
        <span>{props.name}</span>
        <FormInput {...props} />
    </label>
);

class LobbyDefinition extends PureComponent {
    render() {
        const { props } = this;
        const { lobbyDefinition, children } = props;
        const formItems = Object.keys(lobbyDefinition).map(key => (
            <FormItem key={key} name={key} {...lobbyDefinition[key]} />
        ));

        return (
            <form method="POST">
                <CsrfToken {...props} />
                {children}
                {formItems}
                <button type="submit">Create Lobby</button>
            </form>
        );
    }
}

export default LobbyDefinition;
