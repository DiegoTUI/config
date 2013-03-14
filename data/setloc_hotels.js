
db.hotels.find({"location.latitude":{$ne:null},"location.latitude":{$ne:null}}).forEach(function(hotel){
	hotel.loc = [1*hotel.location.longitude, 1*hotel.location.latitude];
	db.hotels.save(hotel);
});
