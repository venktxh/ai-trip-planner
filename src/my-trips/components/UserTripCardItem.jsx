import React from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="rounded-xl shadow hover:shadow-md transition duration-200 bg-white overflow-hidden hover:scale-105">
        <img
          src="/placeholder.jpg"
          alt="Trip Preview"
          className="object-cover w-full h-[220px] rounded-t-xl"
        />
        <div className="p-3">
          <h2 className="font-bold text-lg truncate">
            {trip?.userSelection?.location || 'Unknown Location'}
          </h2>
          <h2 className="text-sm text-gray-500">
            {trip?.userSelection?.days || '?'} Days trip with {trip?.userSelection?.budget || 'Unknown'} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
