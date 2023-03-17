import { useEffect, useState } from 'react';
import Papa from "papaparse";

const allowedExtensions = ["csv"];

function Import() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);

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

    const getData = () => {
        if (!file) return alert('There is no file');

        const reader = new FileReader();

        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, { header: true });
            const parsedData = csv?.data;
            setData(parsedData);
        }
        reader.readAsText(file);
    }

    const sendJourneys = (localData) => {
        console.log(localData)
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
                //sendStations();
                console.log(localData);
            } else if (data[0].Departure !== undefined) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['Duration (sec.)'] >= 10 && data[i]['Covered distance (m)'] >= 10 && !isNaN(parseInt(data[i]['Departure station id'])) && !isNaN(parseInt(data[i]['Return station id']))) {
                        localData.push({ distance: !isNaN(parseInt(data[i]['Covered distance (m)'])) ? parseInt(data[i]['Covered distance (m)']) : null, departureTime: data[i].Departure, departureStationId: parseInt(data[i]['Departure station id']), returnTime: data[i].Return, returnStationId: parseInt(data[i]['Return station id']), duration: !isNaN(parseInt(data[i]['Duration (sec.)'])) ? parseInt(data[i]['Duration (sec.)']) : null });
                    }
                }
                sendJourneys(localData);
            }
        }
    }, [data]);

    return (
        <div>
            <label htmlFor="csvInput" style={{ display: "block" }}>
                Enter CSV File
            </label>
            <input
                onChange={handleFileChange}
                id="csvInput"
                name="file"
                type="File"
            />
            <div>
                <button onClick={getData}>Get Data</button>
            </div>
        </div>
    );
}

export default Import;
