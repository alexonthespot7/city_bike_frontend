import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { motion } from 'framer-motion';

import { AgGridReact } from "ag-grid-react";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { Link } from "react-router-dom";
import useMediaQuery from "../Hooks/useMediaQuery";

function Journeys() {
    const [dataFetched, setDataFetched] = useState(false);
    const [gridApi, setGridApi] = useState(null);

    const matchesM = useMediaQuery("(min-width: 650px)");

    const gridRef = useRef();

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
    }, []);

    useEffect(() => {
        if (gridApi) {
            setDataFetched(false);
            const dataSource = {
                getRows: (params) => {
                    const page = params.endRow / 100;
                    console.log(params.filterModel["departureStation.name"]);
                    console.log(process.env.REACT_APP_API_URL +
                        `/journeys?page=${page - 1}` +
                        (params.sortModel.length > 0 ? `&sort=${params.sortModel[0].colId}&order=${params.sortModel[0].sort}` : '') +
                        (params.filterModel["departureStation.name"] ? `depValue=${params.filterModel["departureStation.name"].filter}&depOperation=${params.filterModel["departureStation.name"].type}` : '') +
                        (params.filterModel["returnStation.name"] ? `retValue=${params.filterModel['returnStation.name'].filter}&retOperation=${params.filterModel['returnStation.name'].type}` : '') +
                        (params.filterModel.distance ? `distValue=${params.filterModel.distance.filter}&distOperation=${params.filterModel.distance.type}` : '') +
                        (params.filterModel.duration ? `durValue=${params.filterModel.duration.filter}&durOperation=${params.filterModel.duration.type}` : ''));
                    fetch(process.env.REACT_APP_API_URL +
                        `/journeys?page=${page - 1}` +
                        (params.sortModel.length > 0 ? `&sort=${params.sortModel[0].colId}&order=${params.sortModel[0].sort}` : '') +
                        (params.filterModel["departureStation.name"] ? `&depValue=${params.filterModel["departureStation.name"].filter}&depOperation=${params.filterModel["departureStation.name"].type}` : '') +
                        (params.filterModel["returnStation.name"] ? `&retValue=${params.filterModel['returnStation.name'].filter}&retOperation=${params.filterModel['returnStation.name'].type}` : '') +
                        (params.filterModel.distance ? `&distValue=${params.filterModel.distance.filter}&distOperation=${params.filterModel.distance.type}` : '') +
                        (params.filterModel.duration ? `&durValue=${params.filterModel.duration.filter}&durOperation=${params.filterModel.duration.type}` : ''))
                        .then(resp => resp.json())
                        .then(data => {
                            setDataFetched(true);
                            params.successCallback(data.content, data.totalElements);
                        }).catch(err => {
                            params.successCallback([], 0);
                        });
                }
            }

            gridApi.setDatasource(dataSource);
        }
    }, [gridApi]);

    const durationFormatter = (params) => {
        if (params.value) {
            return `${Math.floor(params.value / 60)} min ${params.value % 60} sec`;
        } else {
            return '';
        }
    }

    const distanceFormatter = (params) => {
        if (params.value) {
            return `${Math.floor(params.value / 1000)} km ${params.value % 1000} m`;
        } else {
            return '';
        }
    }

    const [columns, setColumns] = useState([
        {
            headerName: 'Departure station',
            cellRenderer: params => <Link style={{ color: '#050404' }} to={`../stations/'${params.data ? params.data.departureStation.id : ''}`} >{(params.data) ? params.data.departureStation.name : ''}</Link>,
            field: 'departureStation.name',
            type: 'stations'
        },
        {
            headerName: 'Return station',
            cellRenderer: params => <Link style={{ color: '#050404' }} to={`../stations/${(params.data) ? params.data.returnStation.id : ''}`} >{(params.data) ? params.data.returnStation.name : ''}</Link>,
            field: 'returnStation.name',
            type: 'stations'
        },
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
            filterParams: {
                suppressAndOrCondition: true,
                filterOptions: ['contains', 'equals'],
            },
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            narrow: {
                width: 190,
                filter: 'agNumberColumnFilter',
                filterParams: {
                    suppressAndOrCondition: true,
                    filterOptions: ['equals', 'lessThan', 'greaterThan']
                }
            },
            stations: { cellStyle: {} }
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center', justifyContent: 'center' }}
        >
            <Typography variant={matchesM ? 'h5' : 'h6'}>Journeys</Typography>
            <div className="ag-theme-material" style={{ height: 600, width: '80%', maxWidth: 1000, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <AgGridReact
                    ref={gridRef}
                    defaultColDef={defaultColDef}
                    columnTypes={columnTypes}
                    columnDefs={dataFetched ? columns : null}
                    pagination={true}
                    paginationPageSize={100}
                    suppressCellFocus={true}
                    animateRows="true"
                    onGridReady={onGridReady}
                    cacheBlockSize={100}
                    rowModelType={'infinite'}
                >
                    {!dataFetched && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20vh', marginBottom: '55vh' }}><CircularProgress color="fourth" /></div>}
                </AgGridReact>
            </div>
        </motion.div >
    );
}

export default Journeys;