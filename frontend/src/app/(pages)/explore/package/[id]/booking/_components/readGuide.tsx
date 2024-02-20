import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogTitle } from "@mui/material";

interface ReadGuideProps {
  readGuideOpen: boolean;
  setReadGuideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReadGuide({ readGuideOpen, setReadGuideOpen }: ReadGuideProps) {
  return (
    <Dialog open={readGuideOpen} >
      <div className="px-5 py-2">
        <DialogTitle className="text-blue-500 text-center">Reservation Guide</DialogTitle>
        <div>
          <h1 className="font-semibold">1. Reservation of Tour Packages provided</h1>
          <ul className="list-disc pl-8">
            <li>
              <p>Tourists choose a tour package from the input form (detailed package information can be seen on the tour package page)</p>
            </li>
            <li>
              <p>Tourists fill out the reservation form for the desired tour package and/or homestay</p>
            </li>
          </ul>
          <h1 className="font-semibold">2.Customized Tour Package Reservations</h1>
          <ul className="list-disc pl-8">
            <li>
              <p>Tourists can select the 'custom package' button to create the desired package</p>
            </li>
            <li>
              <p>Tourists are asked to fill in what activities, locations and services available in those activities</p>
            </li>
            <li>
              <p>Tourists make a reservation by filling in the tour package reservation form</p>
            </li>
            <li>
              <p>If tourists want to book a homestay, they can fill in the homestay reservation form</p>
            </li>
          </ul>
          <h1 className="font-semibold">3. Homestay Reservation</h1>
          <ul className="list-disc pl-8">
            <li>
              <p>If tourists only want to make a homestay reservation without a tour package, they can fill in the 'custom reservation' form</p>
            </li>
            <li>
              <p>Tourists fill their activity day by selecting the desired homestay activity object</p>
            </li>
            <li>
              <p>Then you can fill in the reservation form provided</p>
            </li>
          </ul>
          <h1 className="font-semibold">4. Package Order</h1>
          <ul className="list-disc pl-8">
            <li>
              <p>The minimum order quantity must meet the minimum capacity</p>
            </li>
            <li>
              <p>If there is less than the minimum number of people then the price is calculated as 1 package</p>
            </li>
            <li>
              <p>If there is more than the minimum number of 1 package, then if the additional &lt;5 you pay plus half the package price, if &gt;=5 you pay plus 1 package price, so for multiples of the minimum capacity</p>
            </li>
          </ul>
          <h1 className="font-semibold">5. Reservation Payment</h1>
          <ul className="list-disc pl-8">
            <li>
              <p>Tourists can choose the date and time to check in for the tour package</p>
            </li>
            <li>
              <p>If you reserve a homestay, check-in and check-out of the homestay still starts at 12.00 noon</p>
            </li>
            <li>
              <p>Tour package reservations can be submitted and then please wait for admin confirmation</p>
            </li>
            <li>
              <p>If the admin approves, the deposit payment is 20% of the total reservation price and is paid a maximum of 2 days after the visit</p>
            </li>
            <li>
              <p>Cancellations of reservations can be made up to 3 days after the visit, in this case the deposit paid will be returned</p>
            </li>
            <li>
              <p>If cancellation is made after the 3rd day of the visit, the deposit will not be returned</p>
            </li>
            <li>
              <p>Payment of the remainder of the deposit can be paid on the day of the tourist visit</p>
            </li>
          </ul>
        </div>
        <br />
        <div className="text-center">
          <button className="border-solid border-2 p-2 m-1 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => setReadGuideOpen(!readGuideOpen)}>
            <FontAwesomeIcon icon={faCheck} /> Ok, Understand
          </button>
        </div>
      </div>
    </Dialog>
  )
}