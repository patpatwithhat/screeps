var openStoreFinder = {

    find: function (creep) {
        let closest
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        let destinationStructure
        if (targets.length != 0) {
            destinationStructure = creep.pos.findClosestByPath(targets)
        }
        let haulers
        if (destinationStructure) {
            haulers = creep.room.find(FIND_MY_CREEPS, {
                filter: (newCreep) => {
                    return newCreep.memory.role == 'hauler' &&
                        creep.pos.isNearTo(newCreep) &&
                        creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 0;
                }
            });

        }
        let closestHauler
        if (haulers) {
            closestHauler = destinationStructure.pos.findClosestByPath(haulers)
        }

        if (closestHauler && closestHauler.name != creep.name) {
            console.log("bla", closestHauler.id, creep.id)
            targets = targets.concat(haulers)
        }

        if (targets.length != 0) {
            closest = creep.pos.findClosestByPath(targets)
            if (closest.memory.role == "hauler") {
                console.log("id", closest.id, creep.id)
                return closest.id
            }
        }
        else {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }

        let closetBuilders = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.role == "builder" &&
                    creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 0;
            }
        })
        let closetUpgraders = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.role == "upgrader" &&
                    creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 0;
            }
        })
        targets = closetBuilders.concat(targets)
        targets = closetUpgraders.concat(targets)

        closest = creep.pos.findClosestByPath(targets)
        if (closest) return closest.id
    }
}
module.exports = openStoreFinder;