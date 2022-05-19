var roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let source = 0
        if (creep.memory.source) {
            source = creep.memory.source
        }

        if (creep.memory.repair && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repair = false;
            creep.say('🔄 energy');
        }
        if (!creep.memory.repair && creep.store.getFreeCapacity() == 0) {
            //safe one target
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            targets.sort((a, b) => a.hits - b.hits);
            if(targets.length > 0) {
                creep.memory.targetid = targets[0].id
                creep.memory.repair = true;
                creep.say('⚡ repair');
            }
        }


        if (creep.memory.repair && creep.memory.targetid) {
            //repair the one target, written in memory --> not jumping between targets
            let target = Game.getObjectById(creep.memory.targetid)
            //if target is full hp, get next target
            if(target.hits == target.hitsMax) {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                targets.sort((a, b) => a.hits - b.hits);
                if(targets.length > 0) {
                    creep.memory.targetid = targets[0].id
                }
            }
            else if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store[RESOURCE_ENERGY] > 0
                }
            })
            //first check for containers
            if (targets.length > 0) {
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }else {
                //then harvest for themself
                var sources = creep.room.find(FIND_SOURCES);
                let creepSource = sources[0]
                if (creep.memory.source) {
                    creepSource = Game.getObjectById(creep.memory.source)
                }
                if (creep.harvest(creepSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creepSource, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleRepairer;