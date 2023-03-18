import { useEffect, useState } from 'react';

import { Button, CircularProgress, OutlinedInput, Stack } from '@mui/material';

import Papa from "papaparse";
import Cookies from 'js-cookie';

import { motion } from 'framer-motion';

import '../App.css';

const allowedExtensions = ["csv"];

function Import() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [loaded, setLoaded] = useState(true);

    const handleFileChange = (event) => {
        if (event.target.files.length) {
            const inputFile = event.target.files[0];

            const fileExtension = inputFile?.type.split("/")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                alert("Please input a csv file");
                return;
            }

            setFile(inputFile);
        }
    }

    const importData = () => {
        if (!file) return alert('There is no file');
        setLoaded(false);
        const reader = new FileReader();

        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, { header: true });
            const parsedData = csv?.data;
            if (parsedData.length <= 501) {
                setData(parsedData);
            } else if (Cookies.get('role') !== "ADMIN") {
                setLoaded(true);
                alert('Dataset size is too large for your role.');
            } else {
                setData(parsedData);
            }
        }
        reader.readAsText(file);
    }

    const sendJourneys = (localData) => {
        fetch('http://localhost:8080/sendjourneys', {
            method: 'POST',
            headers: Cookies.get('role') !== 'ADMIN' ? {
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('jwt')
            },
            body: JSON.stringify(localData)
        })
            .then(response => {
                setLoaded(true);
                setFile(null);
                if (response.status === 200) {
                    alert('OK');
                } else if (response.status === 202) {
                    alert('Not all rows were added.');
                } else {
                    alert('Something went wrong during adding the book');
                }
            })
            .catch(err => console.error(err));
    }

    const sendStations = (localData) => {
        fetch('http://localhost:8080/sendstations', {
            method: 'POST',
            headers: Cookies.get('role') !== 'ADMIN' ? {
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('jwt')
            },
            body: JSON.stringify(localData)
        })
            .then(response => {
                setLoaded(true);
                setFile(null);
                if (response.ok) {
                    alert('OK');
                } else {
                    alert('Something went wrong during adding the book');
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (data.length > 0) {
            let localData = [];
            if (data[0].Kaupunki !== undefined) {
                for (let i = 0; i < data.length - 1; i++) {
                    if (!isNaN(parseInt(data[i].ID))) {
                        localData.push({ id: parseInt(data[i].ID), name: data[i].Name, address: data[i].Osoite, city: data[i].Kaupunki === 'Espoo' ? 'Espoo' : 'Helsinki', operator: data[i].Operaattor !== ' ' ? data[i].Operaattor : null, latitude: data[i].x, longitude: data[i].y });
                    }
                }
                sendStations(localData);
            } else if (data[0].Departure !== undefined) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['Duration (sec.)'] >= 10 && data[i]['Covered distance (m)'] >= 10 && !isNaN(parseInt(data[i]['Departure station id'])) && !isNaN(parseInt(data[i]['Return station id']))) {
                        localData.push({ distance: !isNaN(parseInt(data[i]['Covered distance (m)'])) ? parseInt(data[i]['Covered distance (m)']) : null, departureTime: data[i].Departure, departureStationId: parseInt(data[i]['Departure station id']), returnTime: data[i].Return, returnStationId: parseInt(data[i]['Return station id']), duration: !isNaN(parseInt(data[i]['Duration (sec.)'])) ? parseInt(data[i]['Duration (sec.)']) : null });
                    }
                }
                sendJourneys(localData);
            } else {
                setLoaded(true);
                alert('The dataset is unacceptable');
            }
        }
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {loaded && <Stack alignItems='center' marginTop='20vh' marginBottom='55vh' spacing={2} >
                <div className='App'>{Cookies.get('role') === 'ADMIN' ? 'Please select csv file' : 'Please select csv file with no more than 500 rows.'}</div>
                <OutlinedInput
                    sx={{ width: '300px' }}
                    color='thirdary'
                    type="file"
                    onChange={handleFileChange}
                />
                <Button sx={{ width: '150px' }} color='fourth' variant='text' onClick={importData}>Import Data</Button>
            </Stack >}
            {!loaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20vh', marginBottom: '55vh' }}><CircularProgress color="fourth" /></div>}
        </motion.div>
    );
}

export default Import;
