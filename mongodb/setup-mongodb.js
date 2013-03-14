//drop databases first
db.users.drop();
db.tokens.drop();
db.roles.drop();

//input default data
//create roles
db.roles.insert({
	roleId : "admin",
	authServices : ["add_user", "remove_user", "modify_user", "read_user", "list_users"]
});
db.roles.insert({
	roleId : "user",
	authServices : ["read_user"]
});

//create users
db.users.insert({
	userId : "tstadmin",
	email : "dlafuente@test",
	userName : "tufosa",
	passwordHash : "7f55e74561057195fee288f63e85ea594a2b7a61324097c935982876a616e17c",
	salt : "6c88b529f8eeebf2513b2666749cf960",
	iterations : 10000,
	roleId : "admin",
	created : new Date(),
	lastModified : new Date()
});

db.users.insert({
	userId : "tstuser",
	email : "pepito@test",
	userName : "pepito",
	passwordHash : "feb4a20d27e9afc99d8c2ad03435c228617f9150535137eaa20cab030ea21f59",
	salt : "17fedde203df7666ea54021a47b56929",
	iterations : 10000,
	roleId : "user",
	created : new Date(),
	lastModified : new Date()
});

//create tokens
db.tokens.insert({
	token : "admintoken11",
	userId : "tstadmin",
	created: new Date ()	
});

db.tokens.insert({
	token : "usertoken11",
	userId : "tstuser",
	created: new Date ()	
});

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
db.hotels.ensureIndex({code: 1}, {unique: true});
db.hotels.ensureIndex({loc: "2d"}, {unique: false});
