// drop indexes (warning: not for production use)
db.roles.dropIndexes();
db.tokens.dropIndexes();
db.users.dropIndexes();

// create indexes
db.roles.ensureIndex({roleId: 1}, {unique: true});
db.tokens.ensureIndex({token: 1}, {unique: true});
db.tokens.ensureIndex({userId: 1}, {unique: false});
db.users.ensureIndex({userId: 1}, {unique: true});
db.users.ensureIndex({email: 1}, {unique: true});
db.users.ensureIndex({userName: 1}, {unique: false});
db.users.ensureIndex({roleId: 1}, {unique: false});
