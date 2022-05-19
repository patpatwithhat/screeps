let openStoreFinder = require('openStoreFinder')
let ri = require('roleInfo')



var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let roleInfo = ri.get()
        if (creep.store.getFreeCapacity() > 0 && !creep.memory.isFull) {
            let creepSource = Game.getObjectById(creep.memory.source)
            if (creep.harvest(creepSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creepSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            //rest target to not lock them on containers
            creep.memory.target = undefined
        }
        else {
            creep.memory.isFull = true;
            let target
            if (creep.memory.target) {
                target = Game.getObjectById(creep.memory.target)
                if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    let targetid = openStoreFinder.find(creep)
                    creep.memory.target = targetid
                    target = Game.getObjectById(targetid)
                }
            }
            else {
                let targetid = openStoreFinder.find(creep)
                creep.memory.target = targetid
                target = Game.getObjectById(targetid)
            }
            if (roleInfo["hauler"] == undefined) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }

            } else {
                //drop
                creep.drop(RESOURCE_ENERGY);
            }

            if (creep.store.getCapacity() == creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                creep.memory.isFull = false;
                creep.say('🔄 harvest');
            }
        }
    }
};

module.exports = roleHarvester;