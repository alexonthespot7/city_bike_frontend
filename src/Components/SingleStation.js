import { CircularProgress, Divider, ListItem, ListItemText, Typography } from "@mui/material";
import List from '@mui/material/List';
import { useEffect, useState } from "react";

import { motion } from 'framer-motion';

import { useNavigate, useParams } from "react-router-dom";

import MyMap from './MyMap.js';

function SingleStation() {
    const [station, setStation] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);
    const [stationStats, setStationStats] = useState(null);
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
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {dataFetched &&
                <div style={{ display: 'flex', flexDirection: 'column', gap: 35, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5' >Station {station.id}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20vw', marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={14}>NAME </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{station.name}</Typography>
                                <Divider />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={14}>ADDRESS </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{station.address}</Typography>
                                <Divider />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={14}>JOURNEYS STARTING FROM </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{station.journeysFrom}</Typography>
                                <Divider />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1 }} variant='h7' color='#778092' fontSize={14}>JOURNEYS ENDING AT </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{station.journeysTo}</Typography>
                                <Divider />
                            </div>
                        </div>
                    </div>
                    <MyMap coordinates={{ lat: parseFloat(station.latitude), lng: parseFloat(station.longitude) }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5' fontSize={20} >Station Statistics</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20vw', marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={14}>THE AVERAGE DISTANCE OF A JOURNEY STARTING FROM </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{`${Math.floor(stationStats.avgDistStartingFrom / 1000)} km ${stationStats.avgDistStartingFrom % 1000} m`}</Typography>
                                <Divider />
                            </div>
                            {stationStats.topPopReturnStations.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={14}>TOP POPULAR RETURN STATIONS FOR JOURNEYS STARTING FROM </Typography>
                                    <List sx={{ maxWidth: 235 }}>
                                        {stationStats.topPopReturnStations.map((value, index) => (
                                            <ListItem
                                                key={index}
                                            >
                                                <ListItemText primary={`${index + 1}. ${value.name}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={14}>THE AVERAGE DISTANCE OF A JOURNEY ENDING AT </Typography>
                                <Typography textAlign='left' noWrap sx={{ minWidth: 235, maxWidth: 235, marginBottom: 0.5 }} fontWeight='bold' fontSize={14} variant='h7'>{`${Math.floor(stationStats.avgDistEndingAt / 1000)} km ${stationStats.avgDistEndingAt % 1000} m`}</Typography>
                                <Divider />
                            </div>
                            {stationStats.topPopDepStations.length > 0 &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography textAlign='left' sx={{ marginBottom: 1, maxWidth: 235, lineHeight: 1.5 }} variant='h7' color='#778092' fontSize={14}>TOP POPULAR DEPARTURE STATIONS FOR JOURNEYS ENDING AT </Typography>
                                    <List sx={{ maxWidth: 235 }}>
                                        {stationStats.topPopDepStations.map((value, index) => (
                                            <ListItem
                                                key={index}
                                            >
                                                <ListItemText primary={`${index + 1}. ${value.name}`} />
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