import { DialogActions, DialogContent, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { useContext, useState } from "react";

import AuthContext from "../context/AuthContext";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';

import Cookies from "js-cookie";

function Login({ openLogin, setOpenLogin }) {
    const [usernameError, setUsernameError] = useState(false);
    const [usernameHelper, setUsernameHelper] = useState('');
    const [pwdError, setPwdError] = useState(false);
    const [pwdHelper, setPwdHelper] = useState('');
    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const [progress, setProgress] = useState(false);

    const { setIsAlert, setAlertType, setAlertMsg } = useContext(AuthContext);

    const inputChanged = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
        if (event.target.name === 'username') {
            setUsernameError(false);
            setUsernameHelper('');
        } else {
            setPwdError(false);
            setPwdHelper('');
        }
    }

    const loginUser = (creds) => {
        fetch(process.env.REACT_APP_API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        })
            .then(response => {
                if (response.ok) {
                    const jwtToken = response.headers.get('Authorization');
                    if (jwtToken !== null) {
                        setIsAlert(true);
                        setAlertType('success');
                        setAlertMsg('Login proccess went successfully');
                        Cookies.set("jwt", jwtToken, { expires: 1 });
                        const role = response.headers.get('Allow');
                        Cookies.set('role', role, { expires: 1 });
                        setUser({
                            username: '',
                            password: ''
                        });
                        Cookies.set('username', creds.username, { expires: 1 });
                        if (Cookies.get('role') !== undefined && Cookies.get('username') !== undefined && Cookies.get('jwt') !== undefined) window.location.reload();
                    }
                } else if (response.status === 401) {
                    setProgress(false);
                    setUsernameError(true);
                    setUsernameHelper('Incorrect credentials');
                    setPwdError(true);
                    setPwdHelper('Incorrect credentials');
                } else if (response.status === 409) {
                    setProgress(false);
                    setUsernameError(true);
                    setUsernameHelper('Verify your email first');
                } else {
                    setProgress(false);
                    setIsAlert(true);
                    setAlertType('error');
                    setAlertMsg('Something went wrong during the login proccess');
                }
            })
            .catch(err => {
                console.error(err);
                setIsAlert(true);
                setAlertType('error');
                setAlertMsg('Something went wrong during the login proccess');
                setProgress(false);
            })
    }

    const login = () => {
        let check = true;

        if (user.username === '') {
            check = false;
            setUsernameError(true);
            setUsernameHelper('Username cannot be empty')
        }
        if (user.password === '') {
            check = false;
            setPwdError(true);
            setPwdHelper('Password cannot be empty');
        }

        if (check) {
            setProgress(true);
            loginUser(user);
        }
    }

    const handleClose = () => {
        setOpenLogin(false);
        setUsernameError(false);
        setUsernameHelper('');
        setPwdError(false);
        setPwdHelper('');
        setUser({
            username: '',
            password: ''
        });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            {!progress && <Dialog style={{ margin: 'auto', width: '100%', height: '100%' }} open={openLogin} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        size='medium'
                        color="fourth"
                        fullWidth
                        value={user.username}
                        type='text'
                        margin='dense'
                        error={usernameError}
                        helperText={usernameHelper}
                        name='username'
                        label="Username"
                        variant='outlined'
                        onChange={inputChanged}
                    />
                    <TextField
                        size='medium'
                        color="fourth"
                        fullWidth
                        value={user.password}
                        margin='dense'
                        error={pwdError}
                        helperText={pwdHelper}
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        label='Password'
                        variant='outlined'
                        onChange={inputChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions style={{ marginTop: -20 }}>
                    <Button size="small" color='thirdary' sx={{ color: 'white', "&:hover": { filter: 'brightness(50%)', backgroundColor: '#303030' }, transition: '0.45s' }} variant='contained' onClick={login}>Login</Button>
                    <Button size='small' color='fourth' sx={{ "&:hover": { filter: 'brightness(40%)' }, transition: '0.45s' }} variant='outlined' onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>}
            {progress && <Dialog style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} open={openLogin} onClose={handleClose} >
                <DialogTitle>Login</DialogTitle>
                <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 200, height: 300 }}>
                    <CircularProgress color='fourth' size={80} />
                </DialogContent>
            </Dialog>}
        </div>
    )
}

export default Login;