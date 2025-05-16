import { faBed, faCartShopping, faEye, faMosque, faRoad, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { fetchExploreBrowsePackage, fetchExploreMyPackage, fetchExploreOurPackage } from "../../api/fetchers/package";
import { useQuery } from "@tanstack/react-query";

interface PackageSection {
  browseId: string
  browseName: string | null;
  onSearchAroundClick: () => void;
  onShowMapClick: (type: string) => void;
  onSelectActivity: (start: string, end: string) => void;
  onDaySelect: (activities: any[]) => void;
}

export default function BrowsePackage({ browseId, browseName, onShowMapClick, onSelectActivity, onDaySelect }: PackageSection) {
  const [activeDay, setActiveDay] = useState<{ [key: string]: number | null }>({});
  const [selectedDayActivities, setSelectedDayActivities] = useState<{ [key: string]: any[] }>({});
  const { isError, isSuccess, isLoading, data:dataBrowsePackage, error } = useQuery({
      queryKey: ['fetchExploreBrowsePackage', browseId],
      queryFn: () => fetchExploreBrowsePackage(browseId),
      // refetchOnWindowFocus: false
    })
    console.log(dataBrowsePackage);
    
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
        <h1 className="text-2xl font-semibold">Our Package Related to The Place</h1>
        <h1 className="text-2xl ">{browseName}</h1>
      </div>
      {dataBrowsePackage?.length > 0 ? (
        dataBrowsePackage.map((pkg: any) => (
          <div key={pkg.id} className="px-2 text-center w-full rounded-lg hover:bg-slate-200">
            <hr className="my-4 border-t border-gray-300" />
            <div className="mb-6 w-full flex items-center">
              <img
                src={`/photos/package/${pkg.cover_url}`}  
                alt={pkg.name}
                className="w-10 h-10 object-cover mr-4"
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
                <div
                  key={`${pkg.id}-start-0-${pkg.days[activeDay[pkg.id]!].activities[0]}`}
                  onClick={() => handleActivityClick({ activity: "Gerbang Desa Wisata", object_id: "0" }, pkg.days[activeDay[pkg.id]!].activities[0])}
                  className="flex text-blue-500 items-center justify-between px-4 py-2 border border-blue-500 rounded-lg mb-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                >
                  <span><FontAwesomeIcon icon={faRoad}/> {pkg.days[activeDay[pkg.id]!].activities[0].description}</span>
                </div>

                {pkg.days[activeDay[pkg.id]!].activities.slice(0, -1).map((activity: any, index: number) => {
                  const nextActivity = pkg.days[activeDay[pkg.id]!].activities[index + 1];
                  return (
                    <div
                      key={`${pkg.id}-${activity.activity}${activity.object_id}-${activity.activity}${nextActivity.object_id}-`}
                      onClick={() => handleActivityClick(activity, nextActivity)}
                      className="flex text-blue-500 items-center justify-between px-4 py-2 border border-blue-500 rounded-lg mb-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      <span>
                        <FontAwesomeIcon icon={faRoad} /> Then, {activity.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500 italic">Sorry, there are no packages related to this place ({browseName})</p>
        </div>
      )}
    </div>
  )
}