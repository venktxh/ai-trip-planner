import React from 'react';

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.itinerary || [];

  // Group itinerary by day
  const groupedByDay = itinerary.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Places To Visit</h2>

      {Object.entries(groupedByDay).map(([day, places]) => (
        <div key={day} className="mb-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Day {day}</h3>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {places.map((item, index) => {
              const { lat, lng } = item.geoCoordinates;
              const placeName = encodeURIComponent(item.placeName);
              const mapUrl = `https://www.google.com/maps?q=${placeName}@${lat},${lng}`;

              return (
                <a
                  key={index}
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={"/placeholder.jpg"}
                    alt={item.placeName}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="text-base font-bold mb-1">{item.placeName}</h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">{item.placeDetails}</p>

                    <div className="text-xs text-gray-700 space-y-1">
                      <p><span className="font-medium">Best Time:</span> {item.bestTime}</p>
                      <p><span className="font-medium">Travel Time:</span> {item.travelTime}</p>
                      <p><span className="font-medium">Ticket:</span> {item.ticketPricing}</p>
                    </div>

                    <div className="mt-2 flex items-center text-xs text-blue-600 font-medium hover:underline">
                      <span className="mr-1">📍</span>
                      <span>View on Map</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;
