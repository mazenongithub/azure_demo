"use strict";

/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require("./Room");
const CivilEngineer = require("./civilengineer");
const CompareCompany = require("./comparecompany");
const CompareProject = require("./compareproject")
//const { getRandomJoke } = require("./jokes");

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
    /** Make chat user: store connection-device, room.
     *
     * @param send {function} callback to send message to this user
     * @param room {Room} room user will be in
     * */

    constructor(send, roomName, company_id) {
        this._send = send; // "send" function for this user
        this.room = Room.get(roomName, company_id); // room user will be in
        this.name = null; // becomes the username of the visitor
        this.company_id = company_id;

        console.log("27", this.company_id)
        console.log(`created chat in ${this.room.name}`);
    }

    /** Send msgs to this client using underlying connection-send-function.
     *
     * @param data {string} message to send
     * */

    send(data) {
        try {
            this._send(data);
        } catch {
            // If trying to send to a user fails, ignore it
        }
    }

    /** Handle joining: add to room members, announce join.
     *
     * @param name {string} name to use in room
     * */



    /** Handle a chat: broadcast to room.
     *
     * @param text {string} message to send
     * */




    /** Handle a private chat: send to recipient only.
     *
     * @param recipient {string} recipient of chat
     * @param text {string} message to send
     * */



    /** Handle messages from client:
     *
     * @param jsonData {string} raw message data
     *
     * @example<code>
     * - {type: "join", name: username} : join
     * - {type: "chat", text: msg }     : chat
     * </code>
     */



    async projectHandler(jsonData, user_id, userid, company_id, projectid) {


        const msg = JSON.parse(jsonData);
        const civilengineer = new CivilEngineer();

        const defaultproject = (project_id, company_id) => {
            return ({
                project_id,
                company_id,
                schedule: {
                    proposals: [{

                        bidschedule: [{

                        }]
                    }],
                    labor: [],
                    materials: [],

                    equipment: [],
                    bidschedule: []

                },
                actual: {
                    invoices: [{

                        bid: []
                    }],
                    labor: [],
                    materials: [],
                    equipment: [],
                    bid: []

                }
            })

        }

        const getproject = await civilengineer.getProjectByProjectID(projectid)
        let project_id = "";
        if(getproject._ID) {
         project_id = getproject._ID;
        }

        

        if (msg.type === "join") {


            try {

                const myproject = await civilengineer.findMyProjectByID(company_id, project_id)

                if (!myproject) {

                    myproject = defaultproject(project_id, company_id)

                }

                this.name = userid;
                this.room.join(this);
                this.room.broadcast({

                    type: "join",
                    text: `${this.name} ${userid} joined ${this.room.name}`,
                    myproject
                });




            } catch (err) {
                console.log(`Could not fetch project by id ${err}`)
            }



        } else if (msg.type === "construction") {



            try {

                const myprojectdb = await civilengineer.findMyProjectByID(company_id, project_id)
                const compareproject = new CompareProject(msg.myproject, myprojectdb)
                const response = compareproject.getResponse();
                const updateproject = await civilengineer.updateProjectByID(company_id, project_id, msg.myproject)

                this.name = userid;

                this.room.broadcastCompany({
                    type: "construction",
                    text: `${this.name} saved project ${projectid}`,
                    myproject: updateproject,
                    company_id,
                    response
                });


            } catch (err) {
                console.log(`Error could not save project ${err}`)
            }



        }


    }


    async companyHandler(jsonData, user_id, userid, company_id) {
        const msg = JSON.parse(jsonData);
        const civilengineer = new CivilEngineer();
        if (msg.type === "join") {

            if (company_id) {

                const getcompany = await civilengineer.fetchCompanyByID(company_id)

                if (getcompany) {

                    this.name = user_id;
                    this.room.join(this);
                    this.room.broadcast({

                        type: "join",
                        text: `${this.name} ${userid} joined "${this.room.name}".${getcompany.companyid}`,

                    });


                }



            }




        } else if (msg.type === "company") {
            const company = msg.company;
            this.handleCompany(company, company_id)


        }



    }



    /** Connection was closed: leave room, announce exit to others. */

    handleClose() {
        this.room.leave(this);
        this.room.broadcast({
            type: "note",
            text: `${this.name} left ${this.room.name}.`,
        });
    }

    /** Handle get joke: get a joke, send to this user only */


    /** Handle get room members:
     * - gets all room members
     * - send member names to this user only
     */

    handleGetMembers() {
        // members is a Set of user instances
        const members = this.room.getMembers();
        const memberNames = [];

        for (let member of members) {
            memberNames.push(member.name);
        }

        this.send(JSON.stringify(
            {
                name: "In room",
                type: "chat",
                text: memberNames.join(", "),
            }));
    }

    /** Change user's name:
     *
     * @param username {string} new name for this user
     * */

    changeUsername(username) {
        this.name = username;
    }

    /** Handle changing a user's name: broadcast change to room.
    *
    * @param username {string} new name for this user
    * */

    handleChangeUsername(username) {
        const currentName = this.name;
        this.changeUsername(username);
        const updatedName = this.name;

        this.room.broadcast({
            name: "server",
            type: "chat",
            text: `The username for ${currentName} has changed to ${updatedName}`,
        });
    }
}

module.exports = ChatUser;
