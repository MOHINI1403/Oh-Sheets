const Spreadsheet = require('../models/Spreadsheet');

let connectedUsers = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        connectedUsers[socket.id] = {
            id: socket.id
        };
        
        io.emit('updateUserCount', Object.keys(connectedUsers).length);
        console.log(connectedUsers);

        // Listen for a client joining a spreadsheet room
        socket.on('joinSpreadsheet', (spreadsheetId) => {
            console.log(`User ${socket.id} is joining spreadsheet room: ${spreadsheetId}`);
            
            Object.values(socket.rooms).forEach(room => {
                if (room !== socket.id) { // Avoid leaving the default room
                    socket.leave(room);
                }
            });

            // Join the new room
            socket.join(spreadsheetId);
            socket.to(spreadsheetId).emit('message', `User ${socket.id} has joined the room ${spreadsheetId}`);
        });

        // Listen for active cells
        socket.on("activeCellChange", (data) => {
            // socket.broadcast.emit("activeCellChange", data);
            if (data.deselect) {
                socket.to(data.room).emit("activeCellDeselect", {
                    range: data.range,
                    userEmail: data.userEmail
                });
            } else {
                socket.to(data.room).emit("activeCellChange", data);
            }
        
        });

        // Listen for cell update
        socket.on("spreadsheetChange", (data) => {
            // socket.broadcast.emit('spreadsheetChange', data);
            io.to(data.room).emit('spreadsheetChange', data);
        })

        socket.on('message', (data) => {
            console.log('Message received:', data);
            io.to(data.room).emit('message', data.message);
        });

        // Listen for cell edits
        socket.on('editCell', async (data) => {
            const { spreadsheetId, row, col, value } = data;

            // Update the database
            await Spreadsheet.updateOne(
                { _id: spreadsheetId, 'cells.row': row, 'cells.col': col },
                { $set: { 'cells.$.value': value } }
            );

            // Broadcast to all clients in the room
            io.to(spreadsheetId).emit('cellEdited', { row, col, value });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            delete connectedUsers[socket.id];
            io.emit('updateUserCount', Object.keys(connectedUsers).length);
        });
    });
};