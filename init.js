db.createUser({
    user: 'dev',
    pwd: 'password',
    roles: [{role: 'readWrite', db: 'mana'}],
});