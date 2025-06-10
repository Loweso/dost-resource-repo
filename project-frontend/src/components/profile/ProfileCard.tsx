import Image from "next/image";

type ProfileCardProps = {
  profileImageUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  yearLevel: string;
  university: string;
  course: string;
};

export default function ProfileCard({
  profileImageUrl,
  firstName,
  middleName,
  lastName,
  email,
  yearLevel,
  university,
  course,
}: ProfileCardProps) {
  return (
    <div className="max-w-3xl w-full mx-auto bg-white shadow-md rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center sm:items-start">
      {/* Left: Profile Picture */}
      <div className="flex w-full md:w-1/3 md:h-full items-center justify-center p-6">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src={profileImageUrl ? "" : "/images/default_avatar.png"}
            alt="Profile Picture"
            width={144}
            height={144}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Right: User Information */}
      <div className="text-left w-full space-y-2 p-4 md:p-8 bg-blue-100 text-xs sm:text-base">
        <div>
          <span className="font-semibold text-gray-700">First Name: </span>
          <span className="font-creato">{firstName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Middle Name: </span>
          <span className="font-creato">{middleName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Last Name: </span>
          <span className="font-creato">{lastName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email: </span>
          <span className="font-creato">{email}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Year Level: </span>
          <span className="font-creato">{yearLevel}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">University: </span>
          <span className="font-creato">{university}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Course: </span>
          <span className="font-creato">{course}</span>
        </div>
      </div>
    </div>
  );
}
