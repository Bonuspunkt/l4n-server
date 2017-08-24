CREATE TABLE Game (
    Id SERIAL PRIMARY KEY,
    SteamId integer,
    SteamSupport boolean
)

CREATE TABLE Server (
    Id SERIAL PRIMARY KEY,
    Name text NOT NULL,
    Host text NOT NULL,
    Port integer NOT NULL
)

CREATE TABLE ServerGame (
    Id SERIAL PRIMARY KEY,
    ServerId integer REFERENCES Server NOT NULL,
    GameId integer REFERENCES Game NOT NULL,
    ConfigDefinition json
)

CREATE TABLE User (
    Id SERIAL PRIMARY KEY,
    Name text NOT NULL,
    SteamProfileId varchar(512),
    BattleNetProfileId varchar(512),
    Password text,
    Salt text
);

CREATE TABLE Lobby (
    Id SERIAL PRIMARY KEY,
    -- provided server
    ServerGameId integer REFERENCES ServerGame,
    -- custom server
    UserId integer REFERENCES User,
    Game text,

    Name text NOT NULL,
    Start timestamptz,
    MinPlayers integer,
    MaxPlayers NOT NULL,
    Voice integer NOT NULL,
    Misc json
)

CREATE TABLE LobbyUser (
    LobbyId integer REFERENCES Lobby,
    UserId integer REFERENCES User,
    JoinStamp timestamptz,
    PartStamp timestamptz
)
