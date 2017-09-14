import React, { PureComponent } from 'react';
import CommonMark from './CommonMark';

if (process.env.BROWSER) {
    require('./CommonMarkInput.styl');
}

class CommonMarkInput extends PureComponent {
    constructor(props, ...args) {
        super(props, ...args);

        this.state = {};

        this.handleToggle = this.handleToggle.bind(this);
    }

    render() {
        const { className, defaultValue, value } = this.props;
        const { expanded } = this.state;

        const workValue = value === undefined ? defaultValue : value;

        const preview = expanded ? <CommonMark text={workValue} /> : null;

        return (
            <div className={`commonMarkInput ${className}`}>
                <textarea {...this.props} className="commonMarkInput-text" />
                <button type="button" onClick={this.handleToggle}>
                    {expanded ? 'hide preview' : 'show preview'}
                </button>
                {preview}
            </div>
        );
    }

    handleToggle(e) {
        this.setState(state => ({ expanded: !state.expanded }));
    }
}

export default CommonMarkInput;
