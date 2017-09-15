const path = require('path');
const debug = require('debug')('l4n:server:httpServer');

const wwwRoot = path.resolve(__dirname, '../wwwRoot');
const viewDir = path.resolve(__dirname, '../wwwScript');

module.exports = resolve => {
    const settings = resolve('settings').httpServer;

    const express = require('express');
    const app = express();

    /* use this for production
    app.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', `default-src 'self'`);
        next();
    })
    */

    //app.use(require('morgan')('dev'));

    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static(wwwRoot));

    //
    // Setup Sessions
    //
    const session = require('express-session');
    const SQLiteStore = require('connect-sqlite3')(session);
    const sessionConfig = Object.assign(
        {
            cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
            resave: true,
            saveUninitialized: false,
            store: new SQLiteStore(settings.sessionStore),
        },
        settings.session,
    );
    app.use(session(sessionConfig));

    //
    // Setup Passport
    //
    const passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, callback) => callback(null, user.id));
    passport.deserializeUser((userId, callback) => {
        const userRepo = resolve('userRepo');
        const user = userRepo.byId(userId);
        if (!user) {
            return callback(null, null);
        }
        callback(null, user);
    });

    // Setup Local Passport
    const LocalStrategy = require('passport-local').Strategy;
    passport.use(
        new LocalStrategy((username, password, callback) => {
            const userRepo = resolve('userRepo');
            userRepo
                .verify(username, password)
                .then(user => callback(null, user))
                .catch(error => callback(error));
        }),
    );
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/loginFailed' }),
        (req, res) => res.redirect('/'),
    );

    // logout
    app.post('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    //
    // Setup CSRF
    //
    app.use(require('csurf')({ cookie: false }));
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        // handle CSRF token errors here
        res.status(403);
        res.send('session has expired or form tampered with');
    });

    //
    // Setup View
    //
    app.set('views', viewDir);
    app.set('view engine', 'jsx');
    app.engine(
        'jsx',
        require('express-react-views').createEngine({
            babel: {
                presets: ['react'],
                plugins: ['transform-es2015-modules-commonjs'],
            },
        }),
    );

    const store = resolve('publicStore');
    const getProps = (req, ...additional) =>
        Object.assign(
            {},
            store.getState(),
            { user: req.user, csrfToken: req.csrfToken(), params: req.params },
            ...additional,
        );

    app.post('/register', (req, res) => {
        let { username, password1, password2 } = req.body;
        username = username.trim();
        if (!username) {
            return res.render('view/Register', getProps(req, { error: 'username is required' }));
        }
        if (!password1) {
            return res.render('view/Register', getProps(req, { error: 'password is required' }));
        }
        if (password1 !== password2) {
            return res.render('view/Register', getProps(req, { error: 'passwords do not match' }));
        }

        const userRepo = resolve('userRepo');
        userRepo
            .register({ name: username, password: password1 })
            .then(() => res.redirect('/registered'))
            .catch(error => {
                debug(error);
                res.render('view/Register', getProps(req, { error: error.message }));
            });
    });

    app.post('/lobby/custom', (req, res) => {
        const { body: lobby, user } = req;

        // TODO: validate lobby

        const lobbyRepo = resolve('lobbyRepo');
        const lobbyId = lobbyRepo.create({ lobby, user });

        res.redirect(`/lobby/${lobbyId}`);
    });

    app.post('/provider/:provider/game/:game', (req, res) => {
        const { provider, game } = req.params;
        const lobbyRepo = resolve('lobbyRepo');
        const lobbyId = lobbyRepo.create({
            ...req.body,
            provider,
            game,
            user: req.user,
        });
        res.redirect(`/lobby/${lobbyId}`);
    });

    app.post('/lobby/:lobbyId/join', (req, res) => {
        const lobbyId = Number(req.params.lobbyId);
        const { user } = req;

        const lobbyRepo = resolve('lobbyRepo');
        lobbyRepo.join({ lobbyId, userId: user.id });
        return res.redirect(`/lobby/${lobbyId}`);
    });
    app.post('/lobby/:lobbyId/leave', (req, res) => {
        const { user } = req;
        const { lobbyId } = req.params;

        const lobbyRepo = resolve('lobbyRepo');

        lobbyRepo.leave({ lobbyId: Number(lobbyId), userId: user.id });
        return res.redirect('/');
    });
    app.post('/lobby/:lobbyId/destroy', (req, res) => {
        const lobbyId = Number(req.params.lobbyId);
        const { user } = req;

        const lobbyRepo = resolve('lobbyRepo');

        lobbyRepo.destroy({ lobbyId, userId: user.id });
        return res.redirect('/');
    });

    app.post('/user/:userId', (req, res) => {
        const userId = Number(req.params.userId);
        if (req.user.id !== userId) {
            throw Error('forbidden');
        }

        const userRepo = resolve('userRepo');
        userRepo.updateBio({ userId, bio: req.body.bio });
        return res.redirect(`/user/${userId}`);
    });

    return app;
};
