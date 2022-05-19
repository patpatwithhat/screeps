let ri = require('roleInfo')
let roomScanner = require('roomScanner')

function checkIfRoomHasContainers(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER
        }
    });
    return targets.length > 0
}

function moveToIdlePoint(creep) {
    creep.say('idle...');
    creep.memory.waitingSince++
    let target = Game.flags["idleFlag"]
    creep.moveTo(target)
}

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let ROLEINFO = ri.get()

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 energy');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.upgrading = true;
            creep.memory.waitingSince = 0
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            if (creep.memory.waitingSince > 300) {
                creep.suicide()
            }
            let roomScanResult = roomScanner.getMaxHarvesterCount(creep.room)
            if (ROLEINFO['harvester'] < roomScanResult || ROLEINFO['hauler'] < roomScanResult -1 || ROLEINFO['harvester'] == undefined) {
                moveToIdlePoint(creep)
                return
            }
            var targets
            if (checkIfRoomHasContainers(creep)) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > 0
                    }
                });
            }
            else {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.store[RESOURCE_ENERGY] > 0
                    }
                });
            }
            let closest = creep.pos.findClosestByPath(targets)
            if (closest) {
                if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleUpgrader;