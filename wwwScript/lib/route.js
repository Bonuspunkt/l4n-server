const paramPattern = /:(\w+)(?:!(\w+))?/g;

const typePattern = type => {
    switch (type) {
        case 'any':
            return '.+';
        case 'number':
            return '\\d+';
        default:
            return '[^/]+';
    }
};
const convert = type => {
    switch (type) {
        case 'number':
            return value => Number(value);
        default:
            return value => value;
    }
};

function route(pattern) {
    const parameterNames = [];
    const conversions = [];

    const rxPattern = pattern.replace(paramPattern, (match, parameterName, type) => {
        parameterNames.push(parameterName);
        conversions.push(convert(type));
        return `(${typePattern(type)})`;
    });

    const rx = new RegExp(`^${rxPattern}$`);

    return function(url) {
        const match = url.match(rx);
        if (!match) {
            return;
        }
        const [, ...captures] = match;

        const mapped = captures.filter(value => value != undefined).map((value, i) => ({
            [parameterNames[i]]: conversions[i](value),
        }));
        return Object.assign({}, ...mapped);
    };
}

module.exports = route;
