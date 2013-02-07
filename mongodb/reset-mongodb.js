//Script to reset the contents of the tui

//input default data
//create roles
db.roles.update({roleId : "admin"},
{	$set:{
		roleId : "admin",
		authServices : ["add_user", "remove_user", "modify_user", "read_user", "list_users"]}},
{upsert : true}
);

db.roles.update({roleId : "user"},
{	$set:{
		roleId : "user",
		authServices : ["read_user"]}},
{upsert : true}
);

//create users
db.users.update({userId : "tstadmin"},
{
	$set:{
		userId : "tstadmin",
		email : "dlafuente@test",
		userName : "tufosa",
		passwordHash : "7f55e74561057195fee288f63e85ea594a2b7a61324097c935982876a616e17c",
		salt : "6c88b529f8eeebf2513b2666749cf960",
		iterations : 10000,
		roleId : "admin",
		created : new Date(),
		lastModified : new Date()}},
{upsert : true}
);

db.users.update({userId : "tstuser"},
{
	$set:{
		userId : "tstuser",
		email : "pepito@test",
		userName : "pepito",
		passwordHash : "feb4a20d27e9afc99d8c2ad03435c228617f9150535137eaa20cab030ea21f59",
		salt : "17fedde203df7666ea54021a47b56929",
		iterations : 10000,
		roleId : "user",
		created : new Date(),
		lastModified : new Date()}},
{upsert : true}
);

//create tokens
db.tokens.update({token : "admintoken11"},
{
	$set:{
		token : "admintoken11",
		userId : "tstadmin",
		created: new Date ()}},
{upsert : true}
);

db.tokens.update({token : "usertoken11"},
{
	$set:{
		token : "usertoken11",
		userId : "tstuser",
		created: new Date ()}},	
{upsert : true}
);

//remove zurullo user
db.users.remove({email:"zurullo@test"});