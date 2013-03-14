
db.hotels.find({"location.latitude":{$ne:null},"location.latitude":{$ne:null}}).forEach(function(hotel){
	var longitude = 1*hotel.location.longitude;
	var latitude = 1*hotel.location.latitude;
	if ((latitude<90)&&(latitude>-90)&&(longitude<180)$$(longitude>-180))
	{
		hotel.loc = [longitude, latitude];
		db.hotels.save(hotel);
	}
	else
	{
		print("Hotel " + hotel.name + " - lat: " + latitude + " - lon: " + longitude);
	}
});
