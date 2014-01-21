//insert testapikey
db.apikeys.update({key:"testapikey"}, {$set:{key:"testapikey", name:"test app", email:"test@test"}}, {upsert:true});

// create indexes
db.apikeys.ensureIndex({key: 1}, {unique: true});
db.tickets.ensureIndex({id: 1}, {unique: true});
db.tickets.ensureIndex({code: 1}, {unique: false});
db.tickets.ensureIndex({destinationCode: 1}, {unique: false});
db.tickets.ensureIndex({loc: "2dsphere"});

