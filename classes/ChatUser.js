"use strict";

/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require("./Room");
const CivilEngineer = require("./civilengineer");
const MyProjects = require("./myprojects")
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
        try {


            let getproject = await civilengineer.getProjectByProjectID(projectid)
            let project_id = "";
            if (getproject.Project_ID) {
                project_id = getproject.Project_ID;
            }




            if (msg.type === "join") {


                if (msg.application === "pm") {

                    const mydefaultproject = (myproject, team, construction) => {
                        let milestones = [];
                        
                        if (myproject) {
                            if (myproject.milestones) {
                                milestones = myproject.milestones
                            }

                        }

                        if (!team) {
                            team = [];
                        }


                        if (!construction) {
                            construction = []
                        }


                        return ({
                            project_id,
                            milestones,
                            team,
                            construction
                        })

                    }


                    try {


                        let MYPROJECTS = new MyProjects(user_id);
                        let myproject = await MYPROJECTS.findProjectByID(project_id)
                        let construction = await civilengineer.findAllProjectsByID(project_id)
                        let dbconnect = await civilengineer.dbConnect();
                        let team = await MYPROJECTS.loadProjectTeamDB(project_id)
                        const getproject = mydefaultproject(myproject, team, construction)
                        let dbdisconnect = await civilengineer.dbDisconnect();


                        this.name = userid;
                        this.room.join(this);

                        this.room.broadcast({

                            type: "join",
                            text: `${this.name} ${userid} joined ${this.room.name}`,
                            myproject: getproject,
                            application:"pm"

                        });


                    } catch (err) {
                        console.log(`Error: Could not Join PM ${err}`)
                    }



                    // end of join pm
                } else {

                    // construction


                    const defaultproject = (project_id, company_id, myproject, pm, team) => {

                        const getteam = (team) => {
                            if (team) {
                                return team
                            } else {
                                return [];
                            }
                        }

                        const getproposals = (myproject) => {
                            if (myproject) {
                                if (myproject.schedule) {
                                    if (myproject.schedule.proposals) {
                                        return myproject.schedule.proposals;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }
                        }

                        const schedulelabor = (myproject) => {

                            if (myproject) {
                                if (myproject.schedule) {
                                    if (myproject.schedule.labor) {
                                        return myproject.schedule.labor;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }


                        const schedulematerials = (myproject) => {

                            if (myproject) {
                                if (myproject.schedule) {
                                    if (myproject.schedule.materials) {
                                        return myproject.schedule.materials;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }


                        const scheduleequipment = (myproject) => {

                            if (myproject) {
                                if (myproject.schedule) {
                                    if (myproject.schedule.equipment) {
                                        return myproject.schedule.equipment;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }

                        const bidschedule = (myproject) => {

                            if (myproject) {
                                if (myproject.schedule) {
                                    if (myproject.schedule.bidschedule) {
                                        return myproject.schedule.bidschedule
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }

                        const getmilestones = (pm) => {
                            if (pm) {

                                if (pm.milestones) {

                                    return pm.milestones
                                } else {
                                    return ([])
                                }

                            } else {
                                return ([])
                            }

                        }


                        const getinvoices = (myproject) => {
                            if (myproject) {
                                if (myproject.actual) {
                                    if (myproject.actual.invoices) {
                                        return myproject.actual.invoices;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }
                        }

                        const actuallabor = (myproject) => {

                            if (myproject) {
                                if (myproject.actual) {
                                    if (myproject.actual.labor) {
                                        return myproject.actual.labor;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }


                        const actualmaterials = (myproject) => {

                            if (myproject) {
                                if (myproject.actual) {
                                    if (myproject.actual.materials) {
                                        return myproject.actual.materials;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }


                        const actualequipment = (myproject) => {

                            if (myproject) {
                                if (myproject.actual) {
                                    if (myproject.actual.equipment) {
                                        return myproject.actual.equipment;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }

                        const bid = (myproject) => {

                            if (myproject) {
                                if (myproject.actual) {
                                    if (myproject.actual.bid) {
                                        return myproject.actual.bid;
                                    } else {
                                        return ([])
                                    }
                                } else {
                                    return ([])
                                }
                            } else {
                                return ([])
                            }

                        }


                        return ({
                            project_id,
                            company_id,
                            schedule: {

                                proposals: getproposals(myproject),
                                labor: schedulelabor(myproject),
                                materials: schedulematerials(myproject),
                                equipment: scheduleequipment(myproject),
                                bidschedule: bidschedule(myproject),

                            },
                            actual: {
                                invoices: getinvoices(myproject),
                                labor: actuallabor(myproject),
                                materials: actualmaterials(myproject),
                                equipment: actualequipment(myproject),
                                bid: bid(myproject)

                            },
                            milestones: getmilestones(pm),
                            team: getteam(team)
                        })

                    }



                    try {


                        let myproject = await civilengineer.findMyProjectByID(company_id, project_id);
                        let MYPROJECTS = new MyProjects(user_id);
                        let pm = await MYPROJECTS.findProjectByID(project_id)
                        let dbconnect = await civilengineer.dbConnect();
                        let team = await MYPROJECTS.loadProjectTeamDB(project_id)
                        let dbdisconnect = await civilengineer.dbDisconnect();

                        myproject = defaultproject(project_id, company_id, myproject, pm, team)
                        this.name = userid;
                        this.room.join(this);
                        this.room.broadcast({

                            type: "join",
                            text: `${this.name} ${userid} joined ${this.room.name}`,
                            myproject,
                            application: "construction"
                        });




                    } catch (err) {
                        console.log(`Could not fetch project by id ${err}`)
                    }


                } // end of join construction



            } else if (msg.type === "construction") {
                //  start of construction


                try {

                    const updateProject = (company_id, project_id, myproject) => {

                        const schedule = (myproject) => {

                            if (myproject) {
                                return myproject.schedule
                            } else {
                                return {}
                            }

                        }

                        const actual = (myproject) => {
                            if (myproject) {
                                return myproject.actual
                            } else {
                                return {}
                            }
                        }

                        return ({
                            company_id,
                            project_id,
                            schedule: schedule(myproject),
                            actual: actual(myproject)
                        })

                    }


                    const myprojectdb = await civilengineer.findMyProjectByID(company_id, project_id)
                    const compareproject = new CompareProject(msg.myproject, myprojectdb)
                    const response = compareproject.getResponse();

                    const updateproject = await civilengineer.updateProjectByID(company_id, project_id, updateProject(company_id, project_id, msg.myproject))

                    this.name = userid;

                    this.room.broadcast({
                        type: "construction",
                        text: `${this.name} saved project ${projectid}`,
                        myproject: updateproject,
                        company_id,
                        response
                    });


                } catch (err) {
                    console.log(`Error could not save project ${err}`)
                }



            } else if (msg.type === "pm") {

                const createProject = (myproject) => {
                    return ({
                        project_id: myproject.project_id,
                        milestones: myproject.milestones

                    })
                }

                const createProjectResponse = (myproject, team) => {
                    return ({
                        project_id: myproject.project_id,
                        milestones: myproject.milestones,
                        team
                    })

                }




                try {

                    let project = msg.project;
                    let createproject = createProject(project)
                    let MYPROJECTS = new MyProjects(user_id);

                    let myprojectdb = await MYPROJECTS.updateProjectByID(project_id, createproject)
                    let response = await MYPROJECTS.handleProjectTeam(project_id, project.team)
                    const team = response.myteam
                    const projectresponse = createProjectResponse(myprojectdb, team)
                    this.name = userid;
                    this.room.broadcast({
                        type: "pm",
                        text: `${this.name} saved project ${projectid}`,
                        myproject: projectresponse
                    })

                } catch (err) {

                    console.log(`Error could not update Project ID ${project_id} ${err} `)

                }



                // load project db

                // compare with project

                // update team 

                // save milestones




            }


        } catch (err) {
            console.log(`Could not fetch project by id ${err}`)
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


    async handleCompany(company, company_id) {
        const civilengineer = new CivilEngineer();

        try {


            const getcompanydb = await civilengineer.fetchCompanyByID(company_id);
            const companydb = getcompanydb.company;
            const compare = new CompareCompany(company, companydb)
            const response = compare.getResponse();
            civilengineer.updateCompanyByID(companydb._id, company)
                .then(succ => {

                    this.room.broadcast({
                        name: this.name,
                        type: "company",
                        response,
                        company: succ
                    });


                })
                .catch((err) => {
                    res.send({ Error: `Could not Fetch Company ${err}` })

                })




            // console.log("handle company ",company)


        } catch (err) {
            console.log(err)
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
