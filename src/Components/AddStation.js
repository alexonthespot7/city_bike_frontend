import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Cookies from "js-cookie";

export default function AddStation() {
    const [open, setOpen] = useState(false);
    const [station, setStation] = useState({
        id: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        name: '',
        operator: ''
    });
    const [error, setError] = useState({
        id: false,
        address: false,
        city: false,
        latitude: false,
        longitude: false,
        name: false,
        operator: false
    });
    const [helperText, setHelperText] = useState({
        id: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        name: '',
        operator: ''
    });

    const { setIsAlert, setAlertType, setAlertMsg } = useContext(AuthContext);

    const inputChanged = (event) => {
        setStation({ ...station, [event.target.name]: event.target.value });
        if (event.target.name === 'id') {
            setError({ ...error, id: false });
            setHelperText({ ...helperText, id: '' });
        } else if (event.target.name === 'address') {
            setError({ ...error, address: false });
            setHelperText({ ...helperText, address: '' });
        } else if (event.target.name === 'city') {
            setError({ ...error, city: false });
            setHelperText({ ...helperText, city: '' });
        } else if (event.target.name === 'latitude') {
            setError({ ...error, latitude: false });
            setHelperText({ ...helperText, latitude: '' });
        } else if (event.target.name === 'longitude') {
            setError({ ...error, longitude: false });
            setHelperText({ ...helperText, longitude: '' });
        } else if (event.target.name === 'name') {
            setError({ ...error, name: false });
            setHelperText({ ...helperText, name: '' });
        } else if (event.target.name === 'operator') {
            setError({ ...error, operator: false });
            setHelperText({ ...helperText, operator: '' });
        }
    }

    const handleOpen = () => {
        setOpen(true);
        setStation({
            id: '',
            address: '',
            city: '',
            latitude: '',
            longitude: '',
            name: '',
            operator: ''
        });
        setError({
            id: false,
            address: false,
            city: false,
            latitude: false,
            longitude: false,
            name: false,
            operator: false
        });
        setHelperText({
            id: '',
            address: '',
            city: '',
            latitude: '',
            longitude: '',
            name: '',
            operator: ''
        });
    }

    const addStation = () => {
        fetch(process.env.REACT_APP_API_URL + '/addstation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('jwt')
            },
            body: JSON.stringify(station)
        })
            .then(response => {
                if (response.ok) {
                    setIsAlert(true);
                    setAlertType('success');
                    setAlertMsg('The station was added successfully');
                    setOpen(false);
                } else if (response.status === 400) {
                    setIsAlert(true);
                    setAlertType('error');
                    setAlertMsg('The id is already in use');
                } else {
                    alert('Something went wrong during adding the station');
                }
            })
            .catch(err => console.error(err));
    }

    const hadnlesave = () => {
        let check = true;
        if (station.id === '') {
            check = false;
            setError({ ...error, id: true });
            setHelperText({ ...helperText, id: 'Id should not be empty' });
        }
        if (station.address === '') {
            check = false;
            setError({ ...error, address: true });
            setHelperText({ ...helperText, address: 'Please type in the address first' });
        }
        if (station.city === '') {
            check = false;
            setError({ ...error, city: true });
            setHelperText({ ...helperText, city: 'City should not be empty' });
        }
        if (station.latitude === '') {
            check = false;
            setError({ ...error, latitude: true });
            setHelperText({ ...helperText, latitude: 'Latitude should not be empty' });
        }
        if (station.longitude === '') {
            check = false;
            setError({ ...error, longitude: true });
            setHelperText({ ...helperText, longitude: 'Longitude should not be empty' });
        }
        if (station.name === '') {
            check = false;
            setError({ ...error, name: true });
            setHelperText({ ...helperText, name: 'Name should not be empty' });
        }
        if (station.operator === '') {
            check = false;
            setError({ ...error, operator: true });
            setHelperText({ ...helperText, operator: 'Operator should not be empty' });
        }

        if (check) {
            addStation();
            setStation({
                id: '',
                address: '',
                city: '',
                latitude: '',
                longitude: '',
                name: '',
                operator: ''
            });
        }
    }

    return (
        <div>
            <Button variant="contained" color="thirdary" startIcon={<AddIcon />} onClick={handleOpen}>
                Add
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New station</DialogTitle>
                <DialogContent>
                    <TextField
                        color='sidish'
                        error={error.id}
                        helperText={helperText.id}
                        margin="dense"
                        name="id"
                        value={station.id}
                        onChange={inputChanged}
                        label="Id"
                        fullWidth
                        type="number"
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.name}
                        helperText={helperText.name}
                        margin="dense"
                        name="name"
                        value={station.name}
                        onChange={inputChanged}
                        label="Name"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.address}
                        helperText={helperText.address}
                        margin="dense"
                        name="address"
                        value={station.address}
                        onChange={inputChanged}
                        label="Address"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.latitude}
                        helperText={helperText.latitude}
                        margin="dense"
                        name="latitude"
                        value={station.latitude}
                        onChange={inputChanged}
                        label="Latitude"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.longitude}
                        helperText={helperText.longitude}
                        margin="dense"
                        name="longitude"
                        value={station.longitude}
                        onChange={inputChanged}
                        label="Longitude"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.city}
                        helperText={helperText.city}
                        margin="dense"
                        name="city"
                        value={station.city}
                        onChange={inputChanged}
                        label="City"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={error.operator}
                        helperText={helperText.operator}
                        margin="dense"
                        name="operator"
                        value={station.operator}
                        onChange={inputChanged}
                        label="Operator"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={hadnlesave}>Save</Button>
                    <Button sx={{ color: 'black' }} onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}