import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { motion } from 'framer-motion';

import { AgGridReact } from "ag-grid-react";
import { CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import '../App.css';
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../Hooks/useMediaQuery";

function Stations() {
    const [stations, setStations] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const matchesM = useMediaQuery("(min-width: 650px)");

    const gridRef = useRef();

    const fetchStations = () => {
        fetch(process.env.REACT_APP_API_URL + '/stations')
            .then(response => response.json())
            .then(data => {
                setStations(data);
                setDataFetched(true);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchStations();
    }, []);

    const navigate = useNavigate();

    const [columns, setColumns] = useState([
        { field: 'name', type: 'wide' },
        { field: 'address', type: 'wide' },
        { field: 'city', type: 'city' },
        { field: 'operator' },
        {
            headerName: 'Station Page',
            cellRenderer: params => <IconButton onClick={() => navigate(`/stations/${params.data.id}`)}><LinkIcon color="primary" /></IconButton>,
            filter: false,
            sortable: false,
            type: 'link'
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 150,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            wide: { width: 300 },
            link: { width: 125 },
            city: { width: 120 }
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
            style={{ display: 'flex', flexDirection: 'column', marginBottom: 40, gap: 15, alignItems: 'center', justifyContent: 'center' }}
        >
            <Typography variant={matchesM ? 'h5' : 'h6'}>Stations</Typography>
            {dataFetched &&
                <div className="ag-theme-material" style={{ height: 550, width: '80%', maxWidth: 1015, margin: 'auto' }}>
                    <TextField
                        style={{ width: '100%', maxWidth: 1015, marginBottom: 10 }}
                        type='search'
                        fullWidth={false}
                        size='small'
                        id="filter-text-box"
                        placeholder="Search for stations..."
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
                        rowData={stations}
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

export default Stations;