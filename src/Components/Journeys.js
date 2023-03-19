import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { motion } from 'framer-motion';

import { AgGridReact } from "ag-grid-react";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function Journeys() {
    const [journeys, setJourneys] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const gridRef = useRef();

    const fetchJourneys = () => {
        fetch(process.env.REACT_APP_API_URL + '/journeys')
            .then(response => response.json())
            .then(data => {
                setJourneys(data);
                setDataFetched(true);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchJourneys();
    }, []);

    const durationFormatter = (params) => {
        return `${Math.floor(params.value / 60)} min ${params.value % 60} sec`;
    }

    const distanceFormatter = (params) => {
        return `${Math.floor(params.value / 1000)} km ${params.value % 1000} m`;
    }

    const [columns, setColumns] = useState([
        { headerName: 'Departure station', field: 'departureStation.name' },
        { headerName: 'Return station', field: 'returnStation.name' },
        {
            field: 'distance',
            type: 'narrow',
            valueFormatter: distanceFormatter
        },
        {
            field: 'duration',
            valueFormatter: durationFormatter,
            type: 'narrow'
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 300,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            narrow: { width: 190, filter: 'agNumberColumnFilter' }
        }
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', justifyContent: 'center' }}
        >
            <Typography variant='h5'>Journeys</Typography>
            {dataFetched &&
                <div className="ag-theme-material" style={{ height: 600, width: 1000, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <TextField
                        type='search'
                        fullWidth={false}
                        size='small'
                        id="filter-text-box"
                        placeholder="Search for journeys..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={onFilterTextBoxChanged}
                    />
                    <AgGridReact
                        ref={gridRef}
                        defaultColDef={defaultColDef}
                        columnTypes={columnTypes}
                        columnDefs={columns}
                        rowData={journeys}
                        pagination={true}
                        paginationPageSize={20}
                        suppressCellFocus={true}
                        animateRows="true"
                    />
                </div>
            }
            {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20vh', marginBottom: '55vh' }}><CircularProgress color="fourth" /></div>}
        </motion.div >
    );
}

export default Journeys;