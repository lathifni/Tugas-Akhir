
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCartShopping, faEye, faMosque, faUtensils } from "@fortawesome/free-solid-svg-icons";

interface ExploreUlakanTableSectionProps {
  onSearchAroundClick: () => void;
  onShowMapClick: (type: string) => void;
}

export default function ExploreUlakanTableSection({ onSearchAroundClick, onShowMapClick, }: ExploreUlakanTableSectionProps) {
  return (
    <div className="py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
      <div className="text-center justify-center">
        <h1 className="text-2xl font-semibold">Explore Ulakan</h1>
      </div>
      <div className="w-full px-5 mt-2">
        <table className="w-full m-5">
          <thead className="w-full">
            <tr>
              <td className="text-center">Name</td>
              <td className="text-center">Action</td>
            </tr>
          </thead>
          <tbody className="w-full">
            <tr>
              <td>
                <FontAwesomeIcon icon={faUtensils} style={{ color: 'red' }} /> Culinery Places
              </td>
              <td className="flex justify-center">
                <button className="bg-blue-500 rounded-lg p-2 hover:bg-blue-600" onClick={() => onShowMapClick('culinary')}>
                  <FontAwesomeIcon icon={faEye} style={{ color: 'white' }} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesomeIcon icon={faBed} style={{ color: 'blue' }} /> Homestay
              </td>
              <td className="flex justify-center">
                <button className="bg-blue-500 rounded-lg p-2 hover:bg-blue-600" onClick={() => onShowMapClick('homestay')}>
                  <FontAwesomeIcon icon={faEye} style={{ color: 'white' }} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesomeIcon icon={faCartShopping} style={{ color: 'hotpink' }} /> Souvenir Places
              </td>
              <td className="flex justify-center">
                <button className="bg-blue-500 rounded-lg p-2 hover:bg-blue-600" onClick={() => onShowMapClick('souvenir')}>
                  <FontAwesomeIcon icon={faEye} style={{ color: 'white' }} />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesomeIcon icon={faMosque} style={{ color: 'green' }} /> Worship Places
              </td>
              <td className="flex justify-center">
                <button className="bg-blue-500 rounded-lg p-2 hover:bg-blue-600" onClick={() => onShowMapClick('worship')}>
                  <FontAwesomeIcon icon={faEye} style={{ color: 'white' }} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div role="button" className="bg-blue-500 rounded-lg hover:bg-blue-600 text-white p-2 flex justify-center mx-8" onClick={onSearchAroundClick}>
          <button>Search Around You</button>
        </div>
      </div>
    </div>
  )
}