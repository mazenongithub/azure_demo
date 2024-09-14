
class CompareProject {

    constructor(myproject, myprojectdb) {

        this.myproject = myproject;
        this.myprojectdb = myprojectdb;
        this.response = {};
        this.response.debug = {};
        this.response.debug.message = "";
        this.response.debug.equipmentdb = [];
        this.response.schedule = {};
        this.response.schedule.insert = [];
        this.response.schedule.update = [];
        this.response.schedule.delete = [];
        this.response.actual = {};
        this.response.actual.update = [];
        this.response.actual.delete = [];
        this.response.actual.insert = [];

        this.handleSchedule();
        this.handleActual();

    }

    handleSchedule() {

        const schedule = this.getSchedule();
        const scheduledb = this.getScheduledb();


        for (let mylabordb of scheduledb.labor) {

            let laboriddb = mylabordb.laborid;
            let user_iddb = mylabordb.user_id;
            let milestoneiddb = mylabordb.milestoneid;
            let csiiddb = mylabordb.csiid;
            let laborratedb = mylabordb.laborrate;
            let timeindb = mylabordb.timein;
            let timeoutdb = mylabordb.timeout;
            let profitdb = mylabordb.profit;
            let proposaliddb = mylabordb.proposalid;
            let deletelabor = true;

            for (let mylabor of schedule.labor) {

                let laborid = mylabor.laborid;
                let user_id = mylabor.user_id;
                let milestoneid = mylabor.milestoneid;
                let csiid = mylabor.csiid;
                let laborrate = mylabor.laborrate;
                let timein = mylabor.timein;
                let timeout = mylabor.timeout;
                let profit = mylabor.profit;
                let proposalid = mylabor.proposalid;

                if (laborid === laboriddb) {
                    deletelabor = false;

                    if (user_id != user_iddb || milestoneid != milestoneiddb || csiid != csiiddb || laborrate != laborratedb || timein != timeindb || timeout != timeoutdb || profit != profitdb || proposalid != proposaliddb) {
                        this.response.schedule.update.push({ laborid, user_id, milestoneid, csiid, laborrate, timein, timeout, profit, proposalid })
                    }


                }






            }

            if (deletelabor) {
                this.response.schedule.delete.push({ laborid: laboriddb })
            }


        } // end of update / delete schedule labor 

        for (let mylabor of schedule.labor) {

            let laborid = mylabor.laborid;
            let user_id = mylabor.user_id;
            let milestoneid = mylabor.milestoneid;
            let csiid = mylabor.csiid;
            let laborrate = mylabor.laborrate;
            let timein = mylabor.timein;
            let timeout = mylabor.timeout;
            let profit = mylabor.profit;
            let proposalid = mylabor.proposalid;

            let insertlabor = true;

            for (let mylabordb of scheduledb.labor) {

                let laboriddb = mylabordb.laborid;

                if (laborid === laboriddb) {
                    insertlabor = false;
                }


            }

            if (insertlabor) {
                this.response.schedule.insert.push({ laborid, user_id, milestoneid, csiid, laborrate, timein, timeout, profit, proposalid })
            }

        } // end of insert schedule labor



        for (let mymaterialdb of scheduledb.materials) {

            let materialiddb = mymaterialdb.materialid;
            let mymaterialiddb = mymaterialdb.mymaterialid;
            let csiiddb = mymaterialdb.csiid;
            let milestoneiddb = mymaterialdb.milestoneid;
            let timeindb = mymaterialdb.timein;
            let quantitydb = mymaterialdb.quantity;
            let unitdb = mymaterialdb.unit;
            let unitcostdb = mymaterialdb.unitcost;
            let profitdb = mymaterialdb.profit;
            let proposaliddb = mymaterialdb.proposalid;
            let deletematerial = true;

            for (let mymaterial of schedule.materials) {

                let materialid = mymaterial.materialid;
                let mymaterialid = mymaterial.mymaterialid;
                let csiid = mymaterial.csiid;
                let milestoneid = mymaterial.milestoneid;
                let timein = mymaterial.timein;
                let quantity = mymaterial.quantity;
                let unit = mymaterial.unit;
                let unitcost = mymaterial.unitcost;
                let profit = mymaterial.profit;
                let proposalid = mymaterial.proposalid;

                if (materialid === materialiddb) {
                    deletematerial = false;
                    if (mymaterialid != mymaterialiddb || csiid != csiiddb || milestoneid != milestoneiddb || timein != timeindb || quantity != quantitydb || unit != unitdb || unitcost != unitcostdb || profit != profitdb || proposalid != proposaliddb) {

                        this.response.schedule.update.push({ materialid, mymaterialid, csiid, milestoneid, timein, quantity, unit, unitcost, profit, proposalid })
                    }
                }

            }

            if (deletematerial) {
                this.response.schedule.delete.push({ materialid: materialiddb })
            }


        } // end of update / delete schedule labor 

        for (let mymaterial of schedule.materials) {

            let materialid = mymaterial.materialid;
            let mymaterialid = mymaterial.mymaterialid;
            let csiid = mymaterial.csiid;
            let milestoneid = mymaterial.milestoneid;
            let timein = mymaterial.timein;
            let quantity = mymaterial.quantity;
            let unit = mymaterial.unit;
            let unitcost = mymaterial.unitcost;
            let profit = mymaterial.profit;
            let proposalid = mymaterial.proposalid;

            let insertmaterial = true;

            for (let mymaterialdb of scheduledb.materials) {

                let materialiddb = mymaterialdb.materialid;

                if (materialid === materialiddb) {
                    insertmaterial = false;
                }


            }

            if (insertmaterial) {
                this.response.schedule.insert.push({ materialid, mymaterialid, csiid, milestoneid, timein, quantity, unit, unitcost, profit, proposalid })
            }

        } // end of insert schedule labor


        for (let myequipmentdb of scheduledb.equipment) {

            let equipmentiddb = myequipmentdb.equipmentid;
            let myequipmentiddb = myequipmentdb.myequipmentid;
            let csiiddb = myequipmentdb.csiid;
            let milestoneiddb = myequipmentdb.milestoneid;
            let timeindb = myequipmentdb.timein;
            let timeoutdb = myequipmentdb.timeout
            let equipmentratedb = myequipmentdb.equipmentrate;
            let profitdb = myequipmentdb.profit;
            let proposaliddb = myequipmentdb.proposalid;

            let deleteequipment = true;

            for (let myequipment of schedule.equipment) {

                let equipmentid = myequipment.equipmentid;
                let myequipmentid = myequipment.myequipmentid;
                let csiid = myequipment.csiid;
                let milestoneid = myequipment.milestoneid;
                let timein = myequipment.timein;
                let timeout = myequipment.timeout
                let equipmentrate = myequipment.equipmentrate;
                let profit = myequipment.profit;
                let proposalid = myequipment.proposalid;

                if(equipmentiddb === equipmentid) {
                    deleteequipment = false;

                    if(myequipmentid != myequipmentiddb || csiid != csiiddb || milestoneid != milestoneiddb || timein != timeindb || timeout !=timeoutdb || equipmentrate != equipmentratedb || profit !=profitdb || proposalid != proposaliddb) {
                        this.response.schedule.update.push({equipmentid, myequipmentid, csiid, milestoneid, timein, timeout, equipmentrate, profit, proposalid})
                    }
                }

            }

            if(deleteequipment) {
                this.response.schedule.delete.push({equipmentid:equipmentiddb})
            }


        } // end of update / delete schedule equipment

        for (let myequipment of schedule.equipment) {

            let equipmentid = myequipment.equipmentid;
            let myequipmentid = myequipment.myequipmentid;
            let csiid = myequipment.csiid;
            let milestoneid = myequipment.milestoneid;
            let timein = myequipment.timein;
            let timeout = myequipment.timeout
            let equipmentrate = myequipment.equipmentrate;
            let profit = myequipment.profit;
            let proposalid = myequipment.proposalid;
            let insertequipment = true;

            for (let myequipmentdb of scheduledb.equipment) {

                let equipmentiddb = myequipmentdb.equipmentid;

                if(equipmentid === equipmentiddb) {
                    insertequipment = false;
                }

               

            }

            if(insertequipment) {
                this.response.schedule.insert.push({equipmentid, myequipmentid, csiid, milestoneid, timein, timeout, equipmentrate, profit, proposalid})
            }

        } // end of insert schedule equipment


        for (let bidscheduledb of scheduledb.bidschedule) {

            let csiiddb= bidscheduledb.csiid;
            let quantitydb= bidscheduledb.quantity;
            let unitdb=bidscheduledb.unit;
            let deletecsi = true;

            for (let bidschedule of schedule.bidschedule) {

                let csiid= bidschedule.csiid;
                let quantity= bidschedule.quantity;
                let unit=bidschedule.unit;

                if(csiiddb === csiid) {
                    deletecsi = false;

                    if(quantity != quantitydb || unit != unitdb) {
                        this.response.schedule.update.push({csiid, quantity, unit})
                    }
                }

            }

            if(deletecsi) {
                this.response.schedule.delete.push({csiid})
            }


        } // end of update / delete bid schedule

        for (let bidschedule of schedule.bidschedule) {

            let csiid= bidschedule.csiid;
            let quantity= bidschedule.quantity;
            let unit=bidschedule.unit;

            let insertcsi = true;

            for (let bidscheduledb of scheduledb.bidschedule) {

                let csiiddb= bidscheduledb.csiid;

                if(csiid === csiiddb) {
                    insertcsi = false;
                }

            }

            if(insertcsi) {
                this.response.schedule.insert.push({csiid, quantity, unit})
            }

        } // end of insert bid schedule



    }

    getScheduledb() {
        const myproject = this.myprojectdb;
        let schedule = false;
        if (myproject.schedule) {
            schedule = myproject.schedule;
        }
        return schedule;
    }

    getSchedule() {
        const myproject = this.myproject;
        let schedule = false;
        if (myproject.schedule) {
            schedule = myproject.schedule;
        }
        return schedule;
    }


    handleActual() {

        const actual = this.getActual();
        const actualdb = this.getActualdb();
    
    
        for (let mylabordb of actualdb.labor) {
    
            let laboriddb = mylabordb.laborid;
            let user_iddb = mylabordb.user_id;
            let milestoneiddb = mylabordb.milestoneid;
            let csiiddb = mylabordb.csiid;
            let laborratedb = mylabordb.laborrate;
            let timeindb = mylabordb.timein;
            let timeoutdb = mylabordb.timeout;
            let profitdb = mylabordb.profit;
            let proposaliddb = mylabordb.proposalid;
            let deletelabor = true;
    
            for (let mylabor of actual.labor) {
    
                let laborid = mylabor.laborid;
                let user_id = mylabor.user_id;
                let milestoneid = mylabor.milestoneid;
                let csiid = mylabor.csiid;
                let laborrate = mylabor.laborrate;
                let timein = mylabor.timein;
                let timeout = mylabor.timeout;
                let profit = mylabor.profit;
                let proposalid = mylabor.proposalid;
    
                if (laborid === laboriddb) {
                    deletelabor = false;
    
                    if (user_id != user_iddb || milestoneid != milestoneiddb || csiid != csiiddb || laborrate != laborratedb || timein != timeindb || timeout != timeoutdb || profit != profitdb || proposalid != proposaliddb) {
                        this.response.actual.update.push({ laborid, user_id, milestoneid, csiid, laborrate, timein, timeout, profit, proposalid })
                    }
    
    
                }
    
    
    
    
    
    
            }
    
            if (deletelabor) {
                this.response.actual.delete.push({ laborid: laboriddb })
            }
    
    
        } // end of update / delete actual labor 
    
        for (let mylabor of actual.labor) {
    
            let laborid = mylabor.laborid;
            let user_id = mylabor.user_id;
            let milestoneid = mylabor.milestoneid;
            let csiid = mylabor.csiid;
            let laborrate = mylabor.laborrate;
            let timein = mylabor.timein;
            let timeout = mylabor.timeout;
            let profit = mylabor.profit;
            let proposalid = mylabor.proposalid;
    
            let insertlabor = true;
    
            for (let mylabordb of actualdb.labor) {
    
                let laboriddb = mylabordb.laborid;
    
                if (laborid === laboriddb) {
                    insertlabor = false;
                }
    
    
            }
    
            if (insertlabor) {
                this.response.actual.insert.push({ laborid, user_id, milestoneid, csiid, laborrate, timein, timeout, profit, proposalid })
            }
    
        } // end of insert actual labor
    
    
    
        for (let mymaterialdb of actualdb.materials) {
    
            let materialiddb = mymaterialdb.materialid;
            let mymaterialiddb = mymaterialdb.mymaterialid;
            let csiiddb = mymaterialdb.csiid;
            let milestoneiddb = mymaterialdb.milestoneid;
            let timeindb = mymaterialdb.timein;
            let quantitydb = mymaterialdb.quantity;
            let unitdb = mymaterialdb.unit;
            let unitcostdb = mymaterialdb.unitcost;
            let profitdb = mymaterialdb.profit;
            let proposaliddb = mymaterialdb.proposalid;
            let deletematerial = true;
    
            for (let mymaterial of actual.materials) {
    
                let materialid = mymaterial.materialid;
                let mymaterialid = mymaterial.mymaterialid;
                let csiid = mymaterial.csiid;
                let milestoneid = mymaterial.milestoneid;
                let timein = mymaterial.timein;
                let quantity = mymaterial.quantity;
                let unit = mymaterial.unit;
                let unitcost = mymaterial.unitcost;
                let profit = mymaterial.profit;
                let proposalid = mymaterial.proposalid;
    
                if (materialid === materialiddb) {
                    deletematerial = false;
                    if (mymaterialid != mymaterialiddb || csiid != csiiddb || milestoneid != milestoneiddb || timein != timeindb || quantity != quantitydb || unit != unitdb || unitcost != unitcostdb || profit != profitdb || proposalid != proposaliddb) {
    
                        this.response.actual.update.push({ materialid, mymaterialid, csiid, milestoneid, timein, quantity, unit, unitcost, profit, proposalid })
                    }
                }
    
            }
    
            if (deletematerial) {
                this.response.actual.delete.push({ materialid: materialiddb })
            }
    
    
        } // end of update / delete actual material
    
        for (let mymaterial of actual.materials) {
    
            let materialid = mymaterial.materialid;
            let mymaterialid = mymaterial.mymaterialid;
            let csiid = mymaterial.csiid;
            let milestoneid = mymaterial.milestoneid;
            let timein = mymaterial.timein;
            let quantity = mymaterial.quantity;
            let unit = mymaterial.unit;
            let unitcost = mymaterial.unitcost;
            let profit = mymaterial.profit;
            let proposalid = mymaterial.proposalid;
    
            let insertmaterial = true;
    
            for (let mymaterialdb of actualdb.materials) {
    
                let materialiddb = mymaterialdb.materialid;
    
                if (materialid === materialiddb) {
                    insertmaterial = false;
                }
    
    
            }
    
            if (insertmaterial) {
                this.response.actual.insert.push({ materialid, mymaterialid, csiid, milestoneid, timein, quantity, unit, unitcost, profit, proposalid })
            }
    
        } // end of insert actual material
    
    
        for (let myequipmentdb of actualdb.equipment) {
    
            let equipmentiddb = myequipmentdb.equipmentid;
            let myequipmentiddb = myequipmentdb.myequipmentid;
            let csiiddb = myequipmentdb.csiid;
            let milestoneiddb = myequipmentdb.milestoneid;
            let timeindb = myequipmentdb.timein;
            let timeoutdb = myequipmentdb.timeout
            let equipmentratedb = myequipmentdb.equipmentrate;
            let profitdb = myequipmentdb.profit;
            let proposaliddb = myequipmentdb.proposalid;
    
            let deleteequipment = true;
    
            for (let myequipment of actual.equipment) {
    
                let equipmentid = myequipment.equipmentid;
                let myequipmentid = myequipment.myequipmentid;
                let csiid = myequipment.csiid;
                let milestoneid = myequipment.milestoneid;
                let timein = myequipment.timein;
                let timeout = myequipment.timeout
                let equipmentrate = myequipment.equipmentrate;
                let profit = myequipment.profit;
                let proposalid = myequipment.proposalid;
    
                if(equipmentiddb === equipmentid) {
                    deleteequipment = false;
    
                    if(myequipmentid != myequipmentiddb || csiid != csiiddb || milestoneid != milestoneiddb || timein != timeindb || timeout !=timeoutdb || equipmentrate != equipmentratedb || profit !=profitdb || proposalid != proposaliddb) {
                        this.response.actual.update.push({equipmentid, myequipmentid, csiid, milestoneid, timein, timeout, equipmentrate, profit, proposalid})
                    }
                }
    
            }
    
            if(deleteequipment) {
                this.response.actual.delete.push({equipmentid:equipmentiddb})
            }
    
    
        } // end of update / delete actual equipment
    
        for (let myequipment of actual.equipment) {
    
            let equipmentid = myequipment.equipmentid;
            let myequipmentid = myequipment.myequipmentid;
            let csiid = myequipment.csiid;
            let milestoneid = myequipment.milestoneid;
            let timein = myequipment.timein;
            let timeout = myequipment.timeout
            let equipmentrate = myequipment.equipmentrate;
            let profit = myequipment.profit;
            let proposalid = myequipment.proposalid;
            let insertequipment = true;
    
            for (let myequipmentdb of actualdb.equipment) {
    
                let equipmentiddb = myequipmentdb.equipmentid;
    
                if(equipmentid === equipmentiddb) {
                    insertequipment = false;
                }
    
               
    
            }
    
            if(insertequipment) {
                this.response.actual.insert.push({equipmentid, myequipmentid, csiid, milestoneid, timein, timeout, equipmentrate, profit, proposalid})
            }
    
        } // end of insert actual equipment
    
    
        for (let biddb of actualdb.bid) {
    
            let csiiddb= biddb.csiid;
            let quantitydb= biddb.quantity;
            let unitdb=biddb.unit;
            let deletecsi = true;
    
            for (let bid of actual.bid) {
    
                let csiid= bid.csiid;
                let quantity= bid.quantity;
                let unit=bid.unit;
    
                if(csiiddb === csiid) {
                    deletecsi = false;
    
                    if(quantity != quantitydb || unit != unitdb) {
                        this.response.actual.update.push({csiid, quantity, unit})
                    }
                }
    
            }
    
            if(deletecsi) {
                this.response.actual.delete.push({csiid})
            }
    
    
        } // end of update / delete bid actual
    
        for (let bid of actual.bid) {
    
            let csiid= bid.csiid;
            let quantity= bid.quantity;
            let unit=bid.unit;
    
            let insertcsi = true;
    
            for (let biddb of actualdb.bid) {
    
                let csiiddb= biddb.csiid;
    
                if(csiid === csiiddb) {
                    insertcsi = false;
                }
    
            }
    
            if(insertcsi) {
                this.response.actual.insert.push({csiid, quantity, unit})
            }
    
        } // end of insert bid actual
    
    
    
    }
    
    getActualdb() {
        const myproject = this.myprojectdb;
        let actual = false;
        if (myproject.actual) {
            actual = myproject.actual;
        }
        return actual;
    }
    
    getActual() {
        const myproject = this.myproject;
        let actual = false;
        if (myproject.actual) {
            actual = myproject.actual;
        }
        return actual;
    }





    getResponse() {
        return this.response;

    }


}

module.exports = CompareProject;