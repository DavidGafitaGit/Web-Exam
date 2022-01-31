import {useState, useEffect} from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import {post, put, get} from '../Calls.js';
import {meetingRoute} from '../ApiRoutes.js';
import { useNavigate, useParams } from 'react-router-dom';
import {Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton, DialogTitle} from '@material-ui/core';

export default function AddMeeting(){

    const [meeting, setMeeting] = useState
    ({
        MeetingDescription: "",
        MeetingURL: "",
        MeetingDate: "2018-03-29"
    });

    const navigate = useNavigate();
    const routerParams = useParams();
    const id = routerParams.id;
    const [rows, setRows] = useState([]);

    useEffect(async () => {
        if (!id)
            return;

        let data = await get(meetingRoute, id);
        setMeeting(data);    
    }, [])

     const onChangeMeeting = e => {
         setMeeting({...meeting, [e.target.name]: e.target.value});
     }

    const saveMeeting = async () => {
        if (!id)
            await post(meetingRoute, meeting);
        else
            await put(meetingRoute, id, meeting);
            
        navigate("/");    
    }

    return (
        <div>

            <DialogTitle align='left'>
                <b>Add a meeting</b>
            </DialogTitle>

            <Grid container spacing={3}>
                <Grid item xs={8} sm={8}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="MeetingDescription"
                        name="MeetingDescription"
                        label="Meeting description"
                        fullWidth
                        value={meeting.MeetingDescription}
                        onChange={e => onChangeMeeting(e)}
                        />
                </Grid>

                <Grid item xs={4} sm={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="MeetingURL"
                        name="MeetingURL"
                        label="Meeting URL"
                        fullWidth
                        value={meeting.MeetingURL}
                        onChange={e => onChangeMeeting(e)}
                        />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="MeetingDate"
                        name="MeetingDate"
                        label="Meeting date"
                        fullWidth
                        value={meeting.MeetingDate}
                        onChange={e => onChangeMeeting(e)}
                        />
                </Grid>
            </Grid>

            <br/>
            <br/>

            <Button color="secondary" variant='outlined' startIcon={<CancelIcon />}
                onClick={() => {navigate("/")}}
            >
                Cancel
            </Button>  

            <Button color="primary" variant='outlined' startIcon={<SaveIcon />}
                onClick={saveMeeting}
            >
                Save
            </Button> 

            <br/>
            <br/>

            <DialogTitle align='left'>
                <b>Add participants (Optional)</b>
            </DialogTitle>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Participant Id</TableCell>
                            <TableCell align="left">Participant Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ParticipantId}>
                                <TableCell component="th" scope="row">
                                    {row.ParticipantId}
                                </TableCell>
                                <TableCell align='left'>{}</TableCell>
                                <TableCell align='left'>{}</TableCell>
                                <TableCell align='left'>{}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <br/>
            <br/>

            <Button color="primary" variant='outlined' startIcon={<AddIcon />}
            >
                Add participant to meeting
            </Button> 

        </div>
    )
}