'use client'

import { useQuery } from "@tanstack/react-query"
import { fetchDataDashboard, fetchDataDayAnalysis, fetchDataPackageAnalysis, fetchDataPeopleAnalysis, fetchDataReferralAnalysis, fetchDataRevenue } from "../../api/fetchers/gtp"
import { useSession } from "next-auth/react";
import { faBed, faBoxOpen, faBuilding, faCalendarDays, faPray, faScrewdriverWrench, faShop, faStar, faUser, faUtensils, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RevenueChart from "./_components/revenueChart";
import PackageChart from "./_components/packageChart";
import DayPieChart from "./_components/dayPieChart";
import PeopleChart from "./_components/peopleChart";
import ReferralChart from "./_components/referralChart";

interface RevenueData {
  month_year: string;
  total_revenue: string;
}

interface TotalStats {
  total: number;
}

interface DashboardStats {
  total_admin: TotalStats;
  total_custumer: TotalStats; 
  total_base_package: TotalStats;
  total_custom_package: TotalStats;
  total_worship_place: TotalStats;
  total_culinary_place: TotalStats;
  total_souvenir_place: TotalStats;
  total_homestay: TotalStats;
  total_unit_homestay: TotalStats;
  total_max_occupancy_homestay: TotalStats;
  total_event: TotalStats;
  total_attraction: TotalStats;
  total_facility: TotalStats;
}

const iconMap: { [key: string]: JSX.Element } = {
  total_admin: <FontAwesomeIcon icon={faUser} size='2x' />,
  total_custumer: <FontAwesomeIcon icon={faUser} size='2x' />,
  total_base_package: <FontAwesomeIcon icon={faBoxOpen} size="2x"/>,
  total_custom_package: <FontAwesomeIcon icon={faScrewdriverWrench} size="2x"/>,
  total_worship_place: <FontAwesomeIcon icon={faPray} size="2x"/>,
  total_culinary_place: <FontAwesomeIcon icon={faUtensils} size="2x"/>,
  total_souvenir_place: <FontAwesomeIcon icon={faShop} size="2x"/>,
  total_homestay: <FontAwesomeIcon icon={faBuilding} size="2x"/>,
  total_unit_homestay: <FontAwesomeIcon icon={faBuilding} size="2x"/>,
  total_max_occupancy_homestay: <FontAwesomeIcon icon={faBed} size="2x"/>,
  total_event: <FontAwesomeIcon icon={faCalendarDays} size="2x"/>,
  total_attraction: <FontAwesomeIcon icon={faStar} size="2x"/>,
  total_facility: <FontAwesomeIcon icon={faWarehouse} size="2x"/>,
}

export default function DashboardPage() {
  const { data:dataDashboard, error:errorDataDashboard } = useQuery<DashboardStats>({
    queryKey: ['dataDashboard'],
    queryFn: fetchDataDashboard
  })
  const { data:dataRevenue, error:errorDataRevenue } = useQuery({
    queryKey: ['dataRevenue'],
    queryFn: fetchDataRevenue
  })
  const { data:dataPackageAnalysis, error:errorDataPackageAnalysis } = useQuery({
    queryKey: ['dataPackageAnalysis'],
    queryFn: fetchDataPackageAnalysis
  })
  const { data:dataDayAnalysis, error:errorDataDayAnalysis } = useQuery({
    queryKey: ['dataDayAnalysis'],
    queryFn: fetchDataDayAnalysis
  })
  const { data:dataPeopleAnalysis, error:errorDataPeopleAnalysis } = useQuery({
    queryKey: ['dataPeopleAnalysis'],
    queryFn: fetchDataPeopleAnalysis
  })
  const { data:dataReferralAnalysis, error:errorDataReferralAnalysis } = useQuery({
    queryKey: ['dataReferralAnalysis'],
    queryFn: fetchDataReferralAnalysis
  })
  const { data: session, status } = useSession();
  
  console.log(dataReferralAnalysis);
  
  if (dataDashboard && dataRevenue && dataPackageAnalysis && dataDayAnalysis && dataPeopleAnalysis && dataReferralAnalysis) {
    return (
      <div className="flex flex-col m-1 sm:m-3 lg:m-5">
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold text-center">Hello, Welcome {session?.user?.name}</h1>
          <h1 className="text-2xl font-semibold text-center">On Dashboard Information</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(dataDashboard).map(([key, value]) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
            const icon = iconMap[key] // Default icon jika tidak ditemukan di map
            return (
              <div key={key} className="bg-white rounded-lg p-4 shadow-md flex items-center">
                <div className="mr-4">{icon}</div>
                <div>
                  <p className="font-bold">{formattedKey}</p>
                  <p>{value.total as number}</p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <RevenueChart data={dataRevenue} />
        </div>
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <PackageChart data={dataPackageAnalysis} />
        </div>
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <PeopleChart data={dataPeopleAnalysis} />
        </div>
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <ReferralChart data={dataReferralAnalysis} />
        </div>
        <div className="w-full h-full px-2 py-4 mb-3 lg:px-4 bg-white rounded-lg">
          <div style={{ width: '50%', margin: '0 auto' }}>
            <DayPieChart data={dataDayAnalysis} />
          </div>
        </div>
      </div>
    )
  }
}