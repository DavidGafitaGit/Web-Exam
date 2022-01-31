import {useState, useEffect} from 'react';
import {get, remove} from '../Calls.js';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton, DialogTitle} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ImportIcon from '@material-ui/icons/Send';
import ExportIcon from '@material-ui/icons/ImportContacts';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import {meetingRoute} from '../ApiRoutes.js';
import { useNavigate } from 'react-router-dom';

export default function MeetingList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(meetingRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteMeeting = async(id, index) => {
        await remove(meetingRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
        alert("Meeting id:" + id + " has been successfully deleted!")
    }

    return(
        <div>

            <DialogTitle>
                <b>Meetings</b>
            </DialogTitle>

            <div>
                <Button
                    variant='contained'
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => {navigate("AddMeeting")}}
                >
                    Add new Meeting
                </Button>
            </div>

            <br/>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Meeting Id</TableCell>
                            <TableCell align="left">Meeting Description</TableCell>
                            <TableCell align="left">Meeting URL</TableCell>
                            <TableCell align="left">Meeting Date</TableCell>
                            <TableCell align="left">Participants</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.MeetingId}>
                                <TableCell component="th" scope="row">
                                    {row.MeetingId}
                                </TableCell>
                                <TableCell align='left'>{row.MeetingDescription}</TableCell>
                                <TableCell align='left'>{row.MeetingURL}</TableCell>
                                <TableCell align='left'>{row.MeetingDate}</TableCell>
                                <TableCell align='left'>
                                    <IconButton onClick={() => navigate(`/Participants/${row.MeetingId}`)}>
                                        <MenuIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left">
                                    <IconButton onClick={() => navigate(`/AddMeeting/${row.MeetingId}`)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteMeeting(row.MeetingId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <br/>
            <br/>
            <br/>

            <Button
                    variant='contained'
                    color="primary"
                    startIcon={<ImportIcon />}
                    onClick={() => {}}
                >
                    Import
                </Button>
                <Button
                    variant='contained'
                    color="primary"
                    startIcon={<ExportIcon />}
                    onClick={() => {}}
                >
                    Export
                </Button>
        </div>
    )
}