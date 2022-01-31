import {useState, useEffect} from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {Grid, TextField, Button} from '@material-ui/core';
import {post, put, get} from '../Calls.js';
import {meetingRoute} from '../ApiRoutes.js';
import { useNavigate, useParams } from 'react-router-dom';

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

        </div>
    )
}