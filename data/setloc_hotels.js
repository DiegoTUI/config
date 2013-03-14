
db.hotels.find({"location.latitude":{$ne:null},{"location.latitude":{$ne:null}}).forEach(function(hotel){
	hotel.loc = [hotel.location.longitude, hotel.location.latitude];
	db.hotels.save(hotel);
});
