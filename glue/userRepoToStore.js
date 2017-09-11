const debug = require('debug')('l4n:server:glue:hookupUserToStore');

function hookup(resolve) {
    const userRepo = resolve('userRepo');
    const publicStore = resolve('publicStore');

    userRepo.on('add', user => {
        const { id, name } = user;

        publicStore.dispatch(state => ({
            ...state,
            users: state.users.concat([{ id, name }]),
        }));
    });
}

module.exports = hookup;
