import React, { PureComponent } from 'react';
import CommonMark from './CommonMark';

if (process.env.BROWSER) {
    require('./CommonMarkInput.styl');
}

class CommonMarkInput extends PureComponent {
    constructor(props, ...args) {
        super(props, ...args);

        this.state = {};

        this.assignTextarea = this.assignTextarea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentWillMount() {
        if (this.props.defaultValue) {
            this.setState({ value: this.props.defaultValue });
        }
    }

    render() {
        const { className } = this.props;
        const { expanded } = this.state;

        const workValue = this.props.value || this.state.value || '';

        const preview = expanded ? <CommonMark text={workValue} /> : null;

        return (
            <div className={`commonMarkInput ${className}`}>
                <textarea
                    ref={this.assignTextarea}
                    onChange={this.handleChange}
                    {...this.props}
                    className="commonMarkInput-text"
                />
                <button type="button" onClick={this.handleToggle}>
                    {expanded ? 'hide preview' : 'show preview'}
                </button>{' '}
                <a href="http://commonmark.org/help/" rel="noopener noreferrer">
                    Markdown Reference
                </a>
                {preview}
            </div>
        );
    }

    assignTextarea(textarea) {
        this.textarea = textarea;
    }

    handleChange(e) {
        const { textarea } = this;
        this.setState({ value: textarea.value });
    }

    handleToggle(e) {
        this.setState(state => ({ expanded: !state.expanded }));
    }
}

export default CommonMarkInput;
