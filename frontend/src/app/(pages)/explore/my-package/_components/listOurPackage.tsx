
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCartShopping, faEye, faMosque, faRoad, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { fetchExploreMyPackage, fetchExploreOurPackage } from "@/app/(pages)/api/fetchers/package";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ExploreUlakanTableSectionProps {
  onSearchAroundClick: () => void;
  onShowMapClick: (type: string) => void;
  onSelectActivity: (start: string, end: string) => void;
  onDaySelect: (activities: any[]) => void;
}

export default function ListOurPackageSection({ onSearchAroundClick, onShowMapClick, onSelectActivity, onDaySelect  }: ExploreUlakanTableSectionProps) {
  const { data: session, status, update } = useSession()
  const [activeDay, setActiveDay] = useState<{ [key: string]: number | null }>({});
  const [selectedDayActivities, setSelectedDayActivities] = useState<{ [key: string]: any[] }>({});
  const { isError, isSuccess, isLoading, data:dataMyPackage, error } = useQuery({
    queryKey: ['fetchExploreMyPackage'],
    queryFn: () => fetchExploreMyPackage(session!.user.user_id),
    enabled: !!session,
    refetchOnWindowFocus: false
  })
  console.log(dataMyPackage);
  const handleDayClick = (packageId: string, dayIndex: number, activities: any[]) => {
    setActiveDay(prev => ({
      ...prev,
      [packageId]: prev[packageId] === dayIndex ? null : dayIndex
    }));
    setSelectedDayActivities(prev => ({
      ...prev,
      [packageId]: prev[packageId] === activities ? [] : activities
    }));

    // Optional: Log activities or perform any action with them
    onDaySelect(activities);
  };

  const handleActivityClick = (activity: any, nextActivity: any) => {
    // Passing the current and next activity IDs to the parent component
    const start = activity.object_id;
    const end = nextActivity ? nextActivity.object_id : "End";
    
    onSelectActivity(start, end);
  };
  
  return (
    <div className="py-1 px-4 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
      <div className="text-center justify-center">
        <h1 className="text-2xl font-semibold">Explore Village With My Package</h1>
      </div>
      <div className="bg-blue-500 hover:bg-blue-600 rounded-lg text-white" onClick={onSearchAroundClick} role="button">
        <button className="m-3">Search Object Around You</button>
      </div>
      {dataMyPackage?.map((pkg: any) => (
        <div key={pkg.id} className="px-2 text-center w-full rounded-lg hover:bg-slate-200">
          {/* Separator */}
          <hr className="my-4 border-t border-gray-300" /> {/* Adjust border color as needed */}
          <div key={pkg.id} className="mb-6 w-full flex items-center">
            <img
              src={`/photos/package/${pkg.cover_url}`}
              alt={pkg.name}
              className="w-10 h-10 object-cover mr-4" // Set a fixed size for the image and add margin
            />
            <h3 className="text-lg font-bold">{pkg.name}</h3>
          </div>
          <div className="flex justify-center mb-2">
            {pkg.days.map((day: any, index: number) => (
              <button
                key={index}
                onClick={() => handleDayClick(pkg.id, index, day.activities)}
                className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg"
              >
                Day {day.day}
              </button>
            ))}
          </div>
          {activeDay[pkg.id] !== null && pkg.days[activeDay[pkg.id]!] && pkg.days[activeDay[pkg.id]!].activities && (
            <div className="mt-2">
              {/* Initial start point leading to the first activity */}
              <div
                key={`${pkg.id}-start-0-${pkg.days[activeDay[pkg.id]!].activities[0]}`}
                onClick={() => handleActivityClick({ activity: "Gerbang Desa Wisata", object_id: "0" }, pkg.days[activeDay[pkg.id]!].activities[0])}
                className="flex text-blue-500 items-center justify-between px-4 py-2 border border-blue-500 rounded-lg mb-1 hover:bg-blue-500 hover:text-white cursor-pointer"
              >
                <span><FontAwesomeIcon icon={faRoad}/> Activity 0 to 1</span>
              </div>

              {/* Looping through activities to create paths to the next */}
              {pkg.days[activeDay[pkg.id]!].activities.slice(0, -1).map((activity: any, index: number) => {
                const nextActivity = pkg.days[activeDay[pkg.id]!].activities[index + 1];
                return (
                  <div
                    key={`${pkg.id}-${activity.activity}${activity.object_id}-${activity.activity}${nextActivity.object_id}-`}
                    onClick={() => handleActivityClick(activity, nextActivity)}
                    className="flex text-blue-500 items-center justify-between px-4 py-2 border border-blue-500 rounded-lg mb-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                  >
                    <span>
                      <FontAwesomeIcon icon={faRoad} /> Activity {activity.activity} to {nextActivity.activity}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}