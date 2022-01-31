// Meeting class defined for the MariaDB database
import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const Participant = db.define("Participant", {

    ParticipantId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    ParticipantName: {
        type: Sequelize.STRING,
        // Range between 5 and 200 characters
        validate: {
            len: [5,200]
        },
        allowNull: false
    }
})

export default Participant;