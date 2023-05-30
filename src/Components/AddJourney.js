import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useMediaQuery from "../Hooks/useMediaQuery";

export default function AddJourney() {
    const [open, setOpen] = useState(false);
    const [journey, setJourney] = useState({
        distance: '',
        duration: '',
        returnTime: dayjs(),
        departureTime: dayjs(),
        returnStationId: '',
        departureStationId: ''
    });
    const [error, setError] = useState({
        distance: false,
        duration: false,
        returnStationId: false,
        departureStationId: false
    });
    const [helperText, setHelperText] = useState({
        distance: '',
        duration: '',
        returnStationId: '',
        departureStationId: ''
    });
    const [stations, setStations] = useState([]);
    const matchesM = useMediaQuery("(min-width: 567px)");

    const fetchStations = () => {
        fetch(process.env.REACT_APP_API_URL + '/stations')
            .then(response => response.json())
            .then(data => {
                setStations(data);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchStations();
    }, []);

    const { setIsAlert, setAlertType, setAlertMsg } = useContext(AuthContext);

    const inputChanged = (event) => {
        setJourney({ ...journey, [event.target.name]: event.target.value });
        if (event.target.name === 'duration') {
            setError({ ...error, duration: false });
            setHelperText({ ...helperText, duration: '' });
        } else if (event.target.name === 'distance') {
            setError({ ...error, distance: false });
            setHelperText({ ...helperText, distance: '' });
        } else if (event.target.name === 'departureStationId') {
            setError({ ...error, departureStationId: false });
            setHelperText({ ...helperText, departureStationId: '' });
        } else if (event.target.name === 'returnStationId') {
            setError({ ...error, returnStationId: false });
            setHelperText({ ...helperText, returnStationId: '' });
        }
    }

    const handleOpen = () => {
        setOpen(true);
        setJourney({
            distance: '',
            duration: '',
            returnTime: dayjs(),
            departureTime: dayjs(),
            returnStationId: '',
            departureStationId: ''
        });
        setError({
            distance: false,
            duration: false,
            returnStationId: false,
            departureStationId: false
        });
        setHelperText({
            distance: '',
            duration: '',
            returnStationId: '',
            departureStationId: ''
        });
    }

    const addJourney = (journeyToSend) => {
        fetch(process.env.REACT_APP_API_URL + '/addjourney', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journeyToSend)
        })
            .then(response => {
                if (response.ok) {
                    setIsAlert(true);
                    setAlertType('success');
                    setAlertMsg('The journey was added successfully');
                    setOpen(false);
                } else {
                    alert('Something went wrong during adding the journey');
                }
            })
            .catch(err => console.error(err));
    }

    const hadnlesave = () => {
        let check = true;
        if (!journey.departureTime.isBefore(journey.returnTime) && !journey.departureTime.isSame(journey.returnTime)) {
            check = false;
            alert('The return time should be later than the departure time');
        }
        if (journey.distance === '' || parseInt(journey.distance) < 10) {
            check = false;
            setError({ ...error, distance: true });
            setHelperText({ ...helperText, distance: 'Distance should not be less than 10 ms' });
        }
        if (journey.duration === '' || parseInt(journey.duration) < 10) {
            check = false;
            setError({ ...error, duration: true });
            setHelperText({ ...helperText, duration: 'Duration should not be less than 10 seconds' });
        }
        if (journey.departureStationId === '') {
            check = false;
            setError({ ...error, departureStationId: true });
            setHelperText({ ...helperText, departureStationId: 'Please select departure station first' });
        }
        if (journey.returnStationId === '') {
            check = false;
            setError({ ...error, returnStationId: true });
            setHelperText({ ...helperText, returnStationId: 'Please select return station first' });
        }

        if (check) {
            const journeyToSend = {
                ...journey,
                departureTime: journey.departureTime.format('YYYY-MM-DD'),
                returnTime: journey.returnTime.format('YYYY-MM-DD')
            }
            addJourney(journeyToSend);
            setJourney({
                distance: '',
                duration: '',
                returnTime: dayjs(),
                departureTime: dayjs(),
                returnStationId: '',
                departureStationId: ''
            });
        }
    }

    return (
        <div>
            <Button variant="contained" color="thirdary" startIcon={<AddIcon />} onClick={handleOpen}>
                Add
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New journey</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: matchesM ? 'row' : 'column', justifyContent: matchesM ? 'space-between' : 'normal', gap: matchesM ? 0 : 15, marginTop: 10 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Departure time"
                                value={journey.departureTime}
                                onChange={(newValue) => setJourney({ ...journey, departureTime: newValue })}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Return time"
                                value={journey.returnTime}
                                onChange={(newValue) => setJourney({ ...journey, returnTime: newValue })}
                            />
                        </LocalizationProvider>
                    </div>
                    <TextField
                        color='sidish'
                        error={error.duration}
                        helperText={helperText.duration}
                        margin="dense"
                        name="duration"
                        value={journey.duration}
                        onChange={inputChanged}
                        label="Duration (sec)"
                        fullWidth
                        type="number"
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.distance}
                        helperText={helperText.distance}
                        margin="dense"
                        name="distance"
                        value={journey.distance}
                        onChange={inputChanged}
                        label="Distance (m)"
                        type="number"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        sx={{ color: 'black' }}
                        variant="outlined"
                        error={error.departureStationId}
                        helperText={helperText.departureStationId}
                        name="departureStationId"
                        select
                        fullWidth
                        label="Departure station"
                        value={journey.departureStationId}
                        onChange={inputChanged}
                        style={{ marginTop: 10 }}
                    >
                        {stations.map((station, index) => (
                            <MenuItem key={index} value={station.id}>
                                {station.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        color='sidish'
                        sx={{ color: 'black' }}
                        variant="outlined"
                        error={error.returnStationId}
                        helperText={helperText.returnStationId}
                        name="returnStationId"
                        select
                        fullWidth
                        label="Return station"
                        value={journey.returnStationId}
                        onChange={inputChanged}
                        style={{ marginTop: 10 }}
                    >
                        {stations.map((station, index) => (
                            <MenuItem key={index} value={station.id}>
                                {station.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={hadnlesave}>Save</Button>
                    <Button sx={{ color: 'black' }} onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}