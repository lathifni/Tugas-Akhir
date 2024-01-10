import { Slider } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";

interface Props {
  onCloseClick: () => void;
  onRadiusChange: (value: number) => void;
  onStateChange: (newState: any) => void;
}

export default function ObjectAroundSection({ onCloseClick, onRadiusChange, onStateChange }: Props) {
  const [state, setState] = useState({
    culinaryPlaces: false,
    homestay: false,
    souvenirPlaces: false,
    worshipPlaces: false
  });
  const [radius, setRadius] = useState(0)

  const radiusHandleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setRadius(newValue);
      onRadiusChange(newValue);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedState = ({
      ...state,
      [event.target.name]: event.target.checked,
    });
    setState(updatedState);
    if (onStateChange) onStateChange(updatedState); 
  };

  const { culinaryPlaces, homestay, souvenirPlaces, worshipPlaces } = state;
  const error = [culinaryPlaces, homestay, souvenirPlaces, worshipPlaces].filter((v) => v).length === 0

  return (
    <div className="mx-3 py-5 flex flex-col lg:w-1/3 items-center bg-white rounded-lg">
      <div className="text-2xl text-center justify-center">
        <h1 className="">Object Around</h1>
      </div>
      <div className="w-full px-5 mt-2">
        <FormControl
          required
          error={error}
          component="fieldset"
          sx={{ m: 3 }}
          variant="standard"
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={culinaryPlaces} onChange={handleChange} name="culinaryPlaces" />
              }
              label="Culinary Places"
            />
            <FormControlLabel
              control={
                <Checkbox checked={homestay} onChange={handleChange} name="homestay" />
              }
              label="Homestay"
            />
            <FormControlLabel
              control={
                <Checkbox checked={souvenirPlaces} onChange={handleChange} name="souvenirPlaces" />
              }
              label="Souvenir Places"
            />
            <FormControlLabel
              control={
                <Checkbox checked={worshipPlaces} onChange={handleChange} name="worshipPlaces" />
              }
              label="Worship Places"
            />
          </FormGroup>
          <FormHelperText>*Choose min one</FormHelperText>
        </FormControl>
        <div className="mx-5">
          <p>Radius: {radius} m</p>
          <Slider
            defaultValue={0}
            value={radius}
            valueLabelDisplay="off"
            onChange={radiusHandleChange}
            step={100}
            marks
            min={0}
            max={2000}
          />
        </div>
      </div>
      <div className="bg-blue-500 rounded-lg text-white" onClick={onCloseClick} role="button">
        <button className="m-3">Close</button>
      </div>
    </div>
  )
}