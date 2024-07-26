
class CompareCompany {

    constructor(company, companydb) {

        this.company = company;
        this.companydb = companydb;
        this.response = {};
        this.response.debug = {};
        this.response.debug.message = "";
        this.response.debug.equipmentdb = [];
        this.response.accounts = {};
        this.response.accounts.insert = [];
        this.response.accounts.update = [];
        this.response.accounts.delete = [];
        this.response.employees = {};
        this.response.employees.update = [];
        this.response.employees.delete = [];
        this.response.employees.insert = [];
        this.response.employees.benefits = {};
        this.response.employees.benefits.update = [];
        this.response.employees.benefits.insert = [];
        this.response.employees.benefits.delete = [];
        this.response.materials = {};
        this.response.materials.update = [];
        this.response.materials.delete = [];
        this.response.materials.insert = [];
        this.response.equipment = {};
        this.response.equipment.update = [];
        this.response.equipment.insert = [];
        this.response.equipment.delete = [];

        this.response.equipment.cost = {};
        this.response.equipment.cost.update = [];
        this.response.equipment.cost.insert = [];
        this.response.equipment.cost.delete = [];



        this.handleCompany()
        this.handleAccounts()
        this.handleEmployees()
        this.handleMaterials();
        this.handleEquipment();
        this.handleEquipmentCosts();
        this.handleBenefits();

    }


    handleBenefits() {


        const benefitsdb = this.getBenefitsdb();
        const benefits = this.getBenefits();

        for (let benefitdb of benefitsdb) {
            let deletebenefit = true;
            let useriddb = benefitdb.user_id;
            let benefitiddb = benefitdb.benefitid;
            let getbenefitdb = benefitdb.benefit;
            let amountdb = benefitdb.amount;
            let frequencydb = benefitdb.frequency
            let accountiddb = benefitdb.accountid;


            for (let benefit of benefits) {

                let userid = benefit.user_id;
                let benefitid = benefit.benefitid;
                let getbenefit = benefit.benefit;
                let amount = benefit.amount;
                let frequency = benefit.frequency
                let accountid = benefit.accountid;

                if (benefitid === benefitiddb) {

                    deletebenefit = false;

                    if (getbenefit != getbenefitdb || amount != amountdb || frequency != frequencydb || accountid != accountiddb) {

                        this.response.employees.benefits.update.push({ user_id: userid, benefitid, benefit: getbenefit, amount, frequency, accountid })
                    }


                }


            }

            if (deletebenefit) {

                this.response.employees.benefits.delete.push({ user_id: useriddb, benefitid: benefitiddb })



            }

        } // end of update delete benefit

        for (let benefit of benefits) {

            let userid = benefit.user_id;
            let benefitid = benefit.benefitid;
            let getbenefit = benefit.benefit;
            let amount = benefit.amount;
            let frequency = benefit.frequency
            let insert = true;

            for (let benefitdb of benefitsdb) {

                let benefitiddb = benefitdb.benefitid;

                if (benefitiddb === benefitid) {
                    insert = false;

                }


            }

            if (insert) {
                this.response.employees.benefits.insert.push({ user_id: benefit.user_id, benefitid, benefit: getbenefit, amount, frequency })
            }



        }




    }



    getBenefitsdb() {

        const employees = this.companydb.employees;
        let getbenefits = [];

        for (let employee of employees) {

            const employeeid = employee.user_id;

            for (let benefit of employee.benefits) {

                const benefitid = benefit.benefitid;
                const getbenefit = benefit.benefit;
                const amount = benefit.amount;
                const frequency = benefit.frequency;
                const accountid = benefit.accountid;

                getbenefits.push({ user_id: employeeid, benefitid, benefit: getbenefit, amount, frequency, accountid })


            }


        }

        return getbenefits;


    }


    getBenefits() {

        const employees = this.company.employees;
        let getbenefits = [];

        for (let employee of employees) {

            const employeeid = employee.user_id;

            for (let benefit of employee.benefits) {

                const benefitid = benefit.benefitid;
                const getbenefit = benefit.benefit;
                const amount = benefit.amount;
                const frequency = benefit.frequency;
                const accountid = benefit.accountid;

                getbenefits.push({ user_id: employeeid, benefitid, benefit: getbenefit, amount, frequency, accountid })


            }


        }

        return getbenefits;


    }



    handleEquipmentCosts() {

        let costs = this.getEquipmentCosts();
        let costsdb = this.getEquipmentCostsdb();


        for (let costdb of costsdb) {

            let deletecost = true;
            let equipmentiddb = costdb.equipmentid;
            let costiddb = costdb.costid;
            let getcostdb = costdb.cost;
            let timeindb = costdb.timein
            let detaildb = costdb.detail
            let frequencydb = "";
            if (costdb.reoccurring) {
                if (costdb.reoccurring.frequency) {

                    frequencydb = costdb.reoccurring.frequency;
                }

            }


            for (let cost of costs) {

                let equipmentid = cost.equipmentid;
                let costid = cost.costid;
                let getcost = cost.cost;
                let timein = cost.timein;
                let detail = cost.detail;
                let frequency = "";
                if (cost.reoccurring) {
                    if (cost.reoccurring.frequency) {

                        frequency = cost.reoccurring.frequency;
                    }

                }


                if (costid === costiddb) {

                    deletecost = false;

                    if (getcostdb != getcost || timeindb != timein || detaildb != detail || frequency != frequencydb) {

                        if (frequency) {

                            this.response.equipment.cost.update.push({ equipmentid, costid: costiddb, cost: getcost, timein, detail, reoccurring: { frequency } })
                        } else {

                            this.response.equipment.cost.update.push({ equipmentid, costid: costiddb, cost: getcost, timein, detail })
                        }
                    }


                }


            }


            if (deletecost) {

                this.response.equipment.cost.delete.push({ equipmentid: equipmentiddb, costid: costiddb })


            }

        } // end of update delete

        for (let cost of costs) {

            let equipmentid = cost.equipmentid;
            let costid = cost.costid;
            let getcost = cost.cost;
            let timein = cost.timein
            let detail = cost.detail

            let insert = true;

            for (let costdb of costsdb) {


                let costiddb = costdb.costid;

                if (costid === costiddb) {

                    insert = false;

                }


            }

            if (insert) {


                this.response.equipment.cost.insert.push({ equipmentid, costid, cost: getcost, timein, detail })
            }


        }


    }


    getEquipmentCostsdb() {

        let equipments = this.companydb.equipment;
        let costs = [];

        for (let equipment of equipments) {

            let equipmentid = equipment.equipmentid;

            if (equipment.ownership) {

                if (equipment.ownership.cost) {

                    for (let cost of equipment.ownership.cost) {

                        let costid = cost.costid;
                        let detail = cost.detail;
                        let timein = cost.timein;
                        let getcost = cost.cost;

                        let frequency = "";
                        if (cost.reoccurring) {
                            if (cost.reoccurring.frequency) {
                                frequency = cost.reoccurring.frequency;
                            }

                        }

                        if (frequency) {

                            costs.push({ equipmentid, costid, detail, cost: getcost, timein, reoccurring: { frequency } })

                        } else {

                            costs.push({ equipmentid, costid, detail, cost: getcost, timein })

                        }




                    }



                }


            }


        }

        return costs;


    }


    getEquipmentCosts() {

        let equipments = this.company.equipment;
        let costs = [];

        for (let equipment of equipments) {

            let equipmentid = equipment.equipmentid;

            if (equipment.ownership) {

                if (equipment.ownership.cost) {

                    for (let cost of equipment.ownership.cost) {

                        let costid = cost.costid;
                        let detail = cost.detail;
                        let timein = cost.timein;
                        let getcost = cost.cost;

                        let frequency = "";
                        if (cost.reoccurring) {
                            if (cost.reoccurring.frequency) {
                                frequency = cost.reoccurring.frequency;
                            }

                        }

                        if (frequency) {

                            costs.push({ equipmentid, costid, detail, cost: getcost, timein, reoccurring: { frequency } })

                        } else {

                            costs.push({ equipmentid, costid, detail, cost: getcost, timein })

                        }




                    }



                }


            }


        }

        return costs;


    }





    handleEquipment() {


        const isRented = (rented) => {
            let check = false;

            if (rented.hourly || rented.weekly || rented.monthly || rented.daily) {
                check = true;
            }

            return check;

        }

        const equipments = this.company.equipment;
        const equipmentsdb = this.companydb.equipment;

        for (let equipmentdb of equipmentsdb) {
            let equipmentiddb = equipmentdb.equipmentid;
            let getequipmentdb = equipmentdb.equipment;
            let accountiddb = equipmentdb.accountid;
            let weeklydb = "";
            let monthlydb = "";
            let dailydb = "";
            let hourlydb = "";
            let purchasedatedb = "";
            let saledatedb = "";
            let purchasedb = "";
            let resalevaluedb = "";
            let loaninterestdb = "";
            let workinghoursdb = "";

            let deleteequipment = true;

            if (isRented(equipmentdb.rented)) {


                weeklydb = equipmentdb.rented.weekly;
                monthlydb = equipmentdb.rented.monthly;
                dailydb = equipmentdb.rented.daily;
                hourlydb = equipmentdb.rented.hourly;


            } else if (equipmentdb.ownership) {
                purchasedatedb = equipmentdb.ownership.purchasedate;
                saledatedb = equipmentdb.ownership.saledate
                purchasedb = equipmentdb.ownership.purchase;
                resalevaluedb = equipmentdb.ownership.resalevalue;

                loaninterestdb = equipmentdb.ownership.loaninterest;
                workinghoursdb = equipmentdb.ownership.workinghours;



            }


            for (let equipment of equipments) {
                let equipmentid = equipment.equipmentid;
                let getequipment = equipment.equipment;
                let accountid = equipment.accountid;
                let weekly = "";
                let monthly = "";
                let daily = "";
                let hourly = "";
                let purchasedate = "";
                let saledate = "";
                let purchase = "";
                let resalevalue = "";
                let loaninterest = "";
                let workinghours = "";

                if (equipment.rented) {



                    weekly = equipment.rented.weekly;
                    monthly = equipment.rented.monthly;
                    daily = equipment.rented.daily;
                    hourly = equipment.rented.hourly;


                } else if (equipment.ownership) {

                    purchasedate = equipment.ownership.purchasedate;
                    saledate = equipment.ownership.saledate
                    purchase = equipment.ownership.purchase;
                    resalevalue = equipment.ownership.resalevalue;
                    loaninterest = equipment.ownership.loaninterest;
                    workinghours = equipment.ownership.workinghours;



                }




                if (equipmentid === equipmentiddb) {
                    deleteequipment = false;



                    if (equipment.rented) {

                        if (getequipmentdb != getequipment || accountid != accountiddb || weekly != weeklydb || hourly != hourlydb || daily != dailydb || monthly != monthlydb) {



                            this.response.equipment.update.push({ equipmentid, equipment: getequipment, accountid, rented: { weekly, monthly, daily, hourly } })

                        }


                    } else if (equipment.ownership) {

                        if (getequipmentdb != getequipment || accountid != accountiddb || resalevalue != resalevaluedb || purchasedate != purchasedatedb || saledate != saledatedb || purchase != purchasedb || loaninterest != loaninterestdb || workinghours != workinghoursdb) {

                            this.response.equipment.update.push({ equipmentid, equipment: getequipment, accountid, ownership: { resalevalue, purchasedate, saledate, purchase, loaninterest, workinghours } })

                        }

                    }








                }


            }

            if (deleteequipment) {

                this.response.equipment.delete.push({ equipmentid: equipmentiddb })



            }

        } // end of update/delete



        for (let equipment of equipments) {
            let insert = true;

            let equipmentid = equipment.equipmentid;
            let getequipment = equipment.equipment;
            let accountid = equipment.accountid;

            for (let equipmentdb of equipmentsdb) {
                let equipmentiddb = equipmentdb.equipmentid;

                if (equipmentid === equipmentiddb) {

                    insert = false;
                }


            }




            if (insert) {



                this.response.equipment.insert.push({ equipment })





            }


        }





    }

    handleMaterials() {

        const materials = this.company.materials;
        const materialsdb = this.companydb.materials;

        for (let materialdb of materialsdb) {

            let materialiddb = materialdb.materialid;
            let getmaterialdb = materialdb.material;
            let accountiddb = materialdb.accountid;
            let unitcostdb = materialdb.unitcost;
            let unitdb = materialdb.unit;
            let deletematerial = true;


            for (let material of materials) {

                let materialid = material.materialid;
                let getmaterial = material.material;
                let accountid = material.accountid;
                let unitcost = material.unitcost;
                let unit = material.unit;

                if (materialid === materialiddb) {
                    deletematerial = false;
                    if (getmaterialdb != getmaterial || accountid != accountiddb || unitcost != unitcostdb || unit != unitdb) {
                        this.response.materials.update.push({ materialid, material: getmaterial, accountid, unitcost, unit })

                    }



                }


            }



            if (deletematerial) {

                this.response.materials.delete.push({ materialid: materialiddb })

            }




        } // end of update/delete




        for (let material of materials) {

            let materialid = material.materialid;
            let getmaterial = material.material;
            let accountid = material.accountid;
            let unitcost = material.unitcost;
            let unit = material.unit;
            let insert = true;

            for (let materialdb of materialsdb) {

                let materialiddb = materialdb.materialid;
                if (materialiddb === materialid) {

                    insert = false;

                }


            }

            if (insert) {

                this.response.materials.insert.push({ materialid, material: getmaterial, accountid, unitcost, unit })

            }


        }









    }




    handleCompany() {

        const company = this.company;
        const companydb = this.companydb;

        const companyid = company.companyid;
        const mycompany = company.company;
        const address = company.address;
        const city = company.city;
        const contactstate = company.contactstate;
        const zipcode = company.zipcode;

        const companyiddb = companydb.companyid;
        const mycompanydb = companydb.company;
        const addressdb = companydb.address;
        const citydb = companydb.city;
        const contactstatedb = companydb.contactstate;
        const zipcodedb = companydb.zipcode

        if (companyid != companyiddb || mycompany != mycompanydb || address != addressdb || city != citydb || contactstate != contactstatedb || zipcode != zipcodedb) {
            this.response.company = { companyid, company: mycompany, address, city, contactstate, zipcode }

        }


    }


    handleAccounts() {

        let accounts = this.company.accounts;

        let accountsdb = this.companydb.accounts;


        for (let accountdb of accountsdb) {
            let accountnamedb = accountdb.accountname;
            let stripedb = accountdb.stripe
            let accountiddb = accountdb.accountid;
            let deleteaccount = true;

            for (let account of accounts) {
                let accountname = account.accountname;
                let stripe = account.stripe
                let accountid = account.accountid;

                if (accountid === accountiddb) {
                    deleteaccount = false;

                    if (accountname != accountnamedb || stripe != stripedb) {


                        this.response.accounts.update.push({ accountid, accountname, stripe })

                    }

                }


            }


            if (deleteaccount) {

                this.response.accounts.delete.push({ accountid: accountiddb })


            }

        }

        // check insert account

        for (let account of accounts) {
            let accountname = account.accountname;
            let stripe = account.stripe
            let accountid = account.accountid;
            let insert = true;


            for (let accountdb of accountsdb) {

                let accountnamedb = accountdb.accountname;
                let stripedb = accountdb.stripe
                let accountiddb = accountdb.accountid;

                if (accountiddb === accountid) {

                    insert = false;


                }


            }


            if (insert) {


                this.response.accounts.insert.push({ accountid, accountname, stripe })

            }


        }


    }

    handleEmployees() {

        const employees = this.company.employees;
        const employeesdb = this.companydb.employees;

        for (let employeedb of employeesdb) {

            let deleteemployee = true;
            let user_iddb = employeedb.user_id;
            let workinghoursdb = employeedb.workinghours;
            let titledb = employeedb.title;


            for (let employee of employees) {

                let user_id = employee.user_id;
                let workinghours = employee.workinghours;
                let title = employee.title;

                if (user_id === user_iddb) {

                    deleteemployee = false;

                    if (workinghours != workinghoursdb || title != titledb) {

                        this.response.employees.update.push({ user_id, title, workinghours })
                    }
                }



            }




            if (deleteemployee) {


                this.response.employees.delete.push({ user_id: user_iddb })



            }

        } // end of update/delete


        for (let employee of employees) {

            let user_id = employee.user_id;
            let workinghours = employee.workinghours;
            let title = employee.title;
            let insert = true;


            for (let employeedb of employeesdb) {


                let user_iddb = employeedb.user_id;
                let workinghoursdb = employeedb.workinghours;
                let titledb = employeedb.title;

                if (user_iddb === user_id) {

                    insert = false;

                }



            }





            if (insert) {

                this.response.employees.insert.push({ user_id, workinghours, title })



            }



        }






    }

    getResponse() {
        return this.response;

    }


}

module.exports = CompareCompany;