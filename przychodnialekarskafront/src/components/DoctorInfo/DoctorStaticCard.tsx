import React from "react";

interface DoctorStaticCardProps {
  pesel: string;
  gender: string;
  dateOfBirth: string;
  lastVisitDate?: string;
  lastVisitDoctor?: number;
  createdAt?: string;
  updatedAt?: string;
}

const PatientStaticCard: React.FC<DoctorStaticCardProps> = ({
  pesel,
  gender,
  dateOfBirth,
  lastVisitDate,
  lastVisitDoctor,
  createdAt,
  updatedAt,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/[0.08] p-5 w-full">
      <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Static Details
      </h5>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <InfoItem label="PESEL" value={pesel} />
        <InfoItem label="Gender" value={gender} />
        <InfoItem label="Date of Birth" value={dateOfBirth} />
        <InfoItem label="Last Visit Date" value={lastVisitDate || "N/A"} />
        <InfoItem label="Last Visit Doctor ID" value={lastVisitDoctor?.toString() || "N/A"} />
        <InfoItem label="Created At" value={createdAt?.split("T")[0] || "N/A"} />
        <InfoItem label="Updated At" value={updatedAt?.split("T")[0] || "N/A"} />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
  </div>
);

export default PatientStaticCard;