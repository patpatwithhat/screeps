let roomScanner = require('roomScanner')
let ri = require('roleInfo')

function getTarget(creep) {
    let target = Game.getObjectById(creep.memory.targetid)
    if (!target) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            return creep.pos.findClosestByPath(targets)
        }
    }
    return target
}

function checkIfRoomHasContainers(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER
        }
    });
    return targets.length > 0
}

function moveToClosestConstructionSite(creep) {
    creep.say('idle...');
    creep.memory.waitingSince++
    let target = getTarget(creep)
    creep.moveTo(target)
}

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let ROLEINFO = ri.get()


        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 energy');
        }

        let target = getTarget(creep)
        if (!(target instanceof ConstructionSite)) {
            //swich to upgrader, if nothing to build
            creep.memory.role = 'upgrader'
            return
        }

        if (!creep.memory.building && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            if (target) {
                creep.memory.targetid = target.id
                creep.memory.building = true;
                creep.say('🚧 build');
            }
        }

        if (creep.memory.building && creep.memory.targetid) {
            if (target && creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        else {

            let roomScanResult = roomScanner.getMaxHarvesterCount(creep.room)
            if (ROLEINFO['harvester'] < roomScanResult || ROLEINFO['hauler'] < roomScanResult -1 || ROLEINFO['harvester'] == undefined) {
                moveToClosestConstructionSite(creep)
                return
            }
            var targets
            if (checkIfRoomHasContainers(creep)) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0
                    }
                })
            } else {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.store[RESOURCE_ENERGY] > 0
                    }
                });
            }

            //first check for targets
            if (targets.length > 0) {
                let closest = creep.pos.findClosestByPath(targets)
                if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }

            else {
                //then harvest for themself
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleBuilder;