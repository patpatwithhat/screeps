let openStoreFinder = require('openStoreFinder')
let ri = require('roleInfo')

function lookForHaulerWithEnergy(creep) {
    return creep.room.find(FIND_MY_CREEPS, {
        filter: (myCreep) => {
            return myCreep.memory.role == "hauler" &&
                !creep.memory.droppedResPosition;
        }
    })
}

function lookForIdleHauler(creep) {
    return creep.room.find(FIND_MY_CREEPS, {
        filter: (myCreep) => {
            return myCreep.memory.role == "hauler" &&
                !creep.memory.droppedResPosition;
        }
    })
}

var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let roleInfo = ri.get()


        if (!creep.memory.empty && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.empty = true;
            creep.say('🛺 load');
        }
        if (creep.memory.empty && creep.store.getFreeCapacity() == 0) {
            creep.memory.empty = false;
            creep.say('🚚 unload');
        }

        if (creep.memory.empty) {
            let droppedRes = Game.getObjectById(creep.memory.droppedResPosition)
            if (creep.pickup(droppedRes) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedRes, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            if (!droppedRes) {
                creep.say("..idle...")
                //return res if some is loaded
            }

        }
        else {
            let targetid = openStoreFinder.find(creep)
            let target = Game.getObjectById(targetid)
            if(target instanceof Creep){
                console.log("Transfer to creepppp")
                //target.cancelOrder('move');
                console.log("equal",creep.name == target.name)
                console.log("pos1", creep.pos)
                console.log("pos2", target.pos)
                console.log("transfer", creep.transfer(target, RESOURCE_ENERGY))
            }

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }


            if (creep.store.getCapacity() == creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                creep.say('🔄 collect');
            }
        }
    }
};

module.exports = roleHauler;