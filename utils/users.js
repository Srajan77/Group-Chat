const users = [];

// join user to chat
 
function userJoin(id, username, room)
{
    const user = {id, username, room};

    users.push(user);

    return user;
}

function getcurrentUser(id){
    return users.find(user => user.id === id);
}

// users leaves the chat

function userLeave(id)
{
    const idx = users.findIndex(user => user.id === id);

    if(idx !== -1)
    {
        return users.splice(idx,1)[0];
    }
}

// get room users

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getcurrentUser,
    userLeave,
    getRoomUsers
};