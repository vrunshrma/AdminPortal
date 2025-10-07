import React from "react";
import { User } from "lucide-react";

const Profile = ({ userData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <User className="mr-3 text-blue-600" size={28} /> Profile Settings
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-gray-600">{userData.position}</p>
            <p className="text-gray-500">Employee ID: {userData.employeeId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
