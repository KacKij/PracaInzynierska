import React from 'react';

interface PatientInfoCardProps {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ firstname, lastname, email, phoneNumber }) => {
    return (
        <div className="rounded-xl bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/[0.08] p-5 w-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Firstname
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {firstname}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Last Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {lastname}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Email address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {email}
                </p>
            </div>

            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {phoneNumber}
                </p>
            </div>
        </div>
        </div>
    );
};

export default PatientInfoCard;