// Meeting class defined for the MariaDB database
import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const Meeting = db.define("Meeting", {

    MeetingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        onDelete: 'CASCADE',
    },

    MeetingDescription: {
        type: Sequelize.STRING,
        // Range between 3 and 200 characters
        validate: {
            len: [3,200]
        },
        allowNull: false
    },

    MeetingURL: {
        type: Sequelize.STRING,
        // Validation as URL
        isURL: true,
        allowNull: false
    },

    MeetingDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

export default Meeting;