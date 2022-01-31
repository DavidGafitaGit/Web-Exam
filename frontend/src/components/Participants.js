import {useState, useEffect} from 'react';
import {get, remove} from '../Calls.js';
import {Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton, DialogTitle} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import {participantRoute} from '../ApiRoutes.js';
import { useNavigate } from 'react-router-dom';

export default function ParticipantList(){
    
    const [rows, setRows] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        let data = await get(participantRoute);
        setRows(data);
    }, [needUpdate]);

    const deleteParticipant = async(id, index) => {
        await remove(participantRoute, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedUpdate(!needUpdate);
        alert("Participant id:" + id + " has been successfully deleted!")
    }

    return(
        <div>

            <br/>
            <DialogTitle align='left'>
                <b>List of participants</b>
            </DialogTitle>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Participant Id</TableCell>
                            <TableCell align="left">Participant Name</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ParticipantId}>
                                <TableCell component="th" scope="row">
                                    {row.ParticipantId}
                                </TableCell>
                                <TableCell align='left'>{row.ParticipantName}</TableCell>
                                <TableCell align="left">
                                    <IconButton onClick={() => deleteParticipant(row.ParticipantId, index)}>
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

            <Button color="primary" variant='outlined' startIcon={<CancelIcon />}
                onClick={() => {navigate("/")}}
            >
                Back
            </Button>  

        </div>
    )
}