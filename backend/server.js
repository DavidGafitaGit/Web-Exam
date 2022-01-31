import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD, SERVER_PORT, DB_NAME } from './Consts.js';
import db from './dbConfig.js';
import Meeting from './entities/Meeting.js';
import Participant from './entities/Participant.js'
import Operators from './Operators.js';

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

let conn;

mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
.then((connection) => {
    conn = connection;
    return connection.query('CREATE DATABASE IF NOT EXISTS ' + DB_NAME);
})
.then(() => {
    return conn.end();
})
.catch((err) => {
    console.warn(err.stack);
})

Meeting.hasMany(Participant, {as : "Participants", foreignKey: "MeetingId"});
Participant.belongsTo(Meeting, { foreignKey: "MeetingId"})

db.sync();

// ---------------------------- Begin Logic functions --------------------

// Logic Functions for Participant
async function createParticipant(participant) {
    return await Participant.create(participant);
}

async function getParticipant() {
    return await Participant.findAll();
}

async function getParticipantById(id) {
    return await Participant.findByPk(id);
}

async function updateParticipant(id, participant) {
    if(parseInt(id) !== participant.ParticipantId) {
        console.log("Entity Id is different!");
        return;
    }

    let updateEntity = await getParticipantById(id);

    if(!updateEntity) {
        console.log("There isn't a participant with this id!");
        return;
    }

    return updateEntity.update(participant);
}

async function deleteParticipant(id) {
    let deleteEntity = await getParticipantById(id);

    if(!deleteEntity) {
        console.log("There isn't a participant with this id!");
        return;
    }

    return await deleteEntity.destroy();
}


// Logic Functions for Meeting
async function createMeeting(meeting) {
    return await Meeting.create(meeting, {include: [{model: Participant, as : "Participants"}]});
}

async function getMeeting() {
    return await Meeting.findAll({include: ["Participants"]});
}

async function getMeetingById(id) {
    return await Meeting.findByPk(id, {include: ["Participants"]});
}

async function updateMeeting(id, meeting) {
    if(parseInt(id) !== meeting.MeetingId) {
        console.log("Entity Id is different!");
        return;
    }

    let updateEntity = await getMeetingById(id);

    if(!updateEntity) {
        console.log("There isn't a meeting with this id!");
        return;
    }

    return updateEntity.update(meeting);
}

async function deleteMeeting(id) {
    let deleteEntity = await getMeetingById(id);

    if(!deleteEntity) {
        console.log("There isn't a meeting with this id!");
        return;
    }

    const deleteEntityWithChilds = () => {
        Participant.destroy({
            where: id ? {MeetingId: id} : undefined
        });

        deleteEntity.destroy();
    }

    return await deleteEntityWithChilds();
}

// Logic Function for filtering
async function filterMeeting(filter){
    let whereClause = {};

    if(filter.meetingURL)
        whereClause.MeetingURL = {[Operators] : `%${filter.meetingURL}%`};

    if(filter.meetingDescription)
        whereClause.MeetingDescription = {[Operators] : `%${filter.meetingDescription}%`};

    return await Meeting.findAll({
        where: whereClause
    });

    // Test in postman : http://localhost:8000/api//meetingFilter?meetingURL=zoom&meetingDescription=Web
}

// Logic Function for sorting
async function getMeetingByDescription(description){
    return await Meeting.findAll({
        where: description ? {MeetingDescription: description} : undefined
    });

    // Test in postman : http://localhost:8000/api//meetingSort?description=Web_Exam
}


// ---------------------------- End Logic functions ----------------------




// ---------------------------- Begin Routes -----------------------------

// Create the database with relations
router.route('/create').get(async (req, res) => {
    try {
        await db.sync({force: true})
        res.status(201).json({message: 'created'});

    } catch (err) {
        console.warn(err.stack);
        res.status(500).json({message: 'server error'});
    }
})

//Routes for Participant
router.route('/participants').post(async (req, res) => {
    res.json(await createParticipant(req.body));
})

router.route('/participants').get(async (req, res) => {
    res.json(await getParticipant(req.body));
})

router.route('/participants/:id').get(async (req, res) => {
    res.json(await getParticipantById(req.params.id));
})

router.route('/participants/:id').put(async (req, res) => {
    res.json(await updateParticipant(req.params.id, req.body));
})

router.route('/participants/:id').delete(async (req, res) => {
    res.json(await deleteParticipant(req.params.id));
})

// Routes for Meeting
router.route('/meeting').post(async (req, res) => {
    res.json(await createMeeting(req.body));
})

router.route('/meeting').get(async (req, res) => {
    res.json(await getMeeting(req.body));
})

router.route('/meeting/:id').get(async (req, res) => {
    res.json(await getMeetingById(req.params.id));
})

router.route('/meeting/:id').put(async (req, res) => {
    res.json(await updateMeeting(req.params.id, req.body));
})

router.route('/meeting/:id').delete(async (req, res) => {
    res.json(await deleteMeeting(req.params.id));
})

router.route('/meetingFilter').get(async (req, res) =>{
    return res.json(await filterMeeting(req.query));
})

router.route('/meetingSort').get( async (req, res) => {
    return res.json(await getMeetingByDescription(req.query.description));
})

// ---------------------------- End Routes -------------------------------

let port = process.env.PORT || SERVER_PORT;
app.listen(port);
console.log(`API is running at ${port}`);