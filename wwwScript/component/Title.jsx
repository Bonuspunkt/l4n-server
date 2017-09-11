import React from 'react';

class Title extends React.PureComponent {
    componentDidMount() {
        const { children } = this.props;
        document.title = children;
    }
    componentDidUpdate(prevProps, prevState) {
        const { children } = this.props;
        if (prevProps.children === children) {
            return;
        }
        document.title = children;
    }
    render() {
        return null;
    }
}

export default Title;
