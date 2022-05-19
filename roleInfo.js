
var roleInfo = {

    get: function () {
        let ROLEINFO = []
        for (let creepName in Game.creeps) {
            //get infos which role is present how often
            let role = Game.creeps[creepName].memory.role
            if (ROLEINFO[role] == undefined) {
                ROLEINFO[role] = 1
            } else {
                ROLEINFO[role]++
            }
        }
        return ROLEINFO
        
    }
};

module.exports = roleInfo;