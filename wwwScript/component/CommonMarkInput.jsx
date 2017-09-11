import React, { PureComponent } from 'react';
import CommonMark from './CommonMark';

if (process.env.BROWSER) {
    require('./CommonMarkInput.styl');
}

class CommonMarkInput extends PureComponent {
    constructor(props, ...args) {
        super(props, ...args);

        this.state = { value: props.value };

        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.value === this.props.value) return;

        this.setState({ value: nextProps.value });
    }

    render() {
        const { name, placeholder, className } = this.props;
        const { value, expanded } = this.state;

        const preview = expanded ? <CommonMark text={value} /> : null;

        return (
            <div className={`commonMarkInput ${className}`}>
                <textarea
                    className="commonMarkInput-text"
                    name={name}
                    defaultValue={value}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                />
                <button type="button" onClick={this.handleToggle}>
                    {expanded ? 'hide preview' : 'show preview'}
                </button>
                {preview}
            </div>
        );
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleToggle(e) {
        this.setState(state => ({ expanded: !state.expanded }));
    }
}

export default CommonMarkInput;
