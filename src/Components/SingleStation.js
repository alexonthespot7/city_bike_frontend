import { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Button, CircularProgress, Divider, IconButton, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import List from '@mui/material/List';

import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";

import { AnimatePresence, motion } from 'framer-motion';

import MyMap from './MyMap.js';
import AuthContext from "../context/AuthContext.js";
import useMediaQuery from "../Hooks/useMediaQuery.js";

function SingleStation() {
    const [station, setStation] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);
    const [stationStats, setStationStats] = useState(null);
    const [filteredStats, setFilteredStats] = useState(null);
    const [date, setDate] = useState(null);
    const [filter, setFilter] = useState(false);

    const { setIsAlert, setAlertType, setAlertMsg } = useContext(AuthContext);

    const matchesM = useMediaQuery("(min-width: 650px)");
    const matchesM1 = useMediaQuery("(min-width: 500px)");

    let { stationid } = useParams();

    const navigate = useNavigate();

    const fetchStationStats = () => {
        fetch(process.env.REACT_APP_API_URL + '/stations/' + stationid + '/stats')
            .then(response => response.json())
            .then(data => {
                setStationStats(data);
                setDataFetched(true);
            })
            .catch(err => {
                console.error(err);
                navigate('/');
            });
    }

    const fetchStation = () => {
        fetch(process.env.REACT_APP_API_URL + '/stations/' + stationid)
            .then(response => response.json())
            .then(data => {
                setStation(data);
                fetchStationStats();
            })
            .catch(err => {
                console.error(err);
                navigate('/');
            });
    }

    useEffect(() => {
        fetchStation();
    }, [date]);

    const fetchFilterStats = () => {
        fetch(process.env.REACT_APP_API_URL + '/stations/' + stationid + '/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: date.toJSON()
        })
            .then(response => response.json())
            .then(data => {
                setFilteredStats(data);
            })
            .catch(err => console.error(err));
    }

    const getFilteredStat = () => {
        if (date) {
            fetchFilterStats();
        } else {
            setIsAlert(true);
            setAlertMsg("Please select date before filtering");
            setAlertType('info');
        }
    }

    const distanceFormatter = (value) => {
        return `${Math.floor(value / 1000)} km ${value % 1000} m`;
    }

    const changeFilter = () => {
        if (filter) {
            setFilteredStats(null);
            setDate(null);
        }
        setFilter(!filter);
    }

    const navigateToStation = (id) => {
        navigate('../stations/' + id);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataFetched &&
                <div style={{ display: 'flex', flexDirection: 'column', gap: 35, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: -15 }}>
                        <Typography variant={matchesM ? 'h5' : 'h6'} >Station {station.id}</Typography>
                        <IconButton size={matchesM ? 'medium' : 'small'} onClick={changeFilter}>{filter ? <FilterListOffIcon /> : <FilterListIcon />}</IconButton>
                    </div>
                    <AnimatePresence>
                        {filter &&
                            <motion.div
                                initial={{ opacity: 0, scale: 0, height: 0 }}
                                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0, height: 0 }}
                                transition={{ duration: 1 }}
                                style={{ display: 'flex', gap: 10, alignItems: 'center', flexDirection: matchesM1 ? 'row' : 'column' }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Choose month"
                                        views={['month', 'year']}
                                        value={date}
                                        onChange={newValue => setDate(newValue)}
                                    />
                                </LocalizationProvider>
                                <Button onClick={getFilteredStat} color='thirdary' variant='outlined'>Filter Stats</Button>
                            </motion.div>
                        }
                    </AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: matchesM ? 'row' : 'column', justifyContent: 'center', gap: matchesM ? '20vw' : 25, marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>NAME </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{station.name}</Typography>
                                <Divider />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>ADDRESS </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{station.address}</Typography>
                                <Divider />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>JOURNEYS STARTING FROM </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{(filteredStats ? filteredStats : stationStats).journeysFrom}</Typography>
                                <Divider />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>JOURNEYS ENDING AT </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{(filteredStats ? filteredStats : stationStats).journeysTo}</Typography>
                                <Divider />
                            </div>
                        </div>
                    </div>
                    <MyMap coordinates={{ lat: parseFloat(station.latitude), lng: parseFloat(station.longitude) }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5' fontSize={matchesM ? 20 : 17} >Station Statistics</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: matchesM ? 'row' : 'column', justifyContent: 'center', gap: matchesM ? '20vw' : 25, marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>THE AVERAGE DISTANCE OF A JOURNEY STARTING FROM </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{distanceFormatter((filteredStats ? filteredStats : stationStats).avgDistStartingFrom)}</Typography>
                                <Divider />
                            </div>
                            {(filteredStats ? filteredStats : stationStats).topPopReturnStations.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>TOP POPULAR RETURN STATIONS FOR JOURNEYS STARTING FROM </Typography>
                                    <List sx={{ maxWidth: 235 }}>
                                        {(filteredStats ? filteredStats : stationStats).topPopReturnStations.map((value, index) => (
                                            <ListItem
                                                key={index}
                                            >
                                                <ListItemText onClick={() => navigateToStation(value.id)} sx={{ cursor: 'pointer', "&:hover": { color: '#778092' }, transition: '0.4s' }} primary={`${index + 1}. ${value.name}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>THE AVERAGE DISTANCE OF A JOURNEY ENDING AT </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={matchesM ? 14 : 12} variant='h7'>{distanceFormatter((filteredStats ? filteredStats : stationStats).avgDistEndingAt)}</Typography>
                                <Divider />
                            </div>
                            {(filteredStats ? filteredStats : stationStats).topPopDepStations.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={matchesM ? 14 : 12}>TOP POPULAR DEPARTURE STATIONS FOR JOURNEYS ENDING AT </Typography>
                                    <List sx={{ maxWidth: 235 }}>
                                        {(filteredStats ? filteredStats : stationStats).topPopDepStations.map((value, index) => (
                                            <ListItem
                                                key={index}
                                            >
                                                <ListItemText onClick={() => navigateToStation(value.id)} sx={{ cursor: 'pointer', "&:hover": { color: '#778092' }, transition: '0.4s' }} primary={`${index + 1}. ${value.name}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
            {!dataFetched &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20vh', marginBottom: '55vh' }}>
                    <CircularProgress color="fourth" />
                </div>
            }
        </motion.div>
    );
}

export default SingleStation;