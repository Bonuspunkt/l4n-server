const cleanUser = ({ id, name, bio }) => ({ id, name, bio });

function hookup(resolve) {
    const userRepo = resolve('userRepo');
    const publicStore = resolve('publicStore');

    publicStore.dispatch(state => ({
        ...state,
        users: userRepo.all().map(cleanUser),
    }));

    userRepo.on('add', user => {
        publicStore.dispatch(state => ({
            ...state,
            users: state.users.concat([cleanUser(user)]),
        }));
    });

    userRepo.on('change', user => {
        publicStore.dispatch(state => ({
            ...state,
            users: state.users.map(u => {
                return u.id === user.id ? { ...u, ...cleanUser(user) } : u;
            }),
        }));
    });
}

module.exports = hookup;
