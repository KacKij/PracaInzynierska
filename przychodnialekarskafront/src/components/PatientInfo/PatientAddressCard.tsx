import React from "react";

interface PatientAddressCardProps {
  street: string;
  streetNumber: string;
  apartmentNumber?: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

const PatientAddressCard: React.FC<PatientAddressCardProps> = ({
  street,
  streetNumber,
  apartmentNumber,
  zipCode,
  city,
  state,
  country,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-white/[0.02] p-4 lg:p-6 rounded-2xl w-full">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Address
      </h4>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Street</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {street} {streetNumber}
            {apartmentNumber && ` / ${apartmentNumber}`}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">ZIP Code</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{zipCode}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">City</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{city}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">State</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{state}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Country</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{country}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientAddressCard;