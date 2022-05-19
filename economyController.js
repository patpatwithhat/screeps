var cas = require('findOpenSources')
let ri = require('roleInfo')

function getHarvesterComponentsByMaxEnergy(roomName) {
    let maxEnergy = Game.rooms[roomName].energyCapacityAvailable
    if (maxEnergy < 550) {
        return [WORK, WORK, CARRY, MOVE]
    }
    if (maxEnergy >= 550 && maxEnergy <= 800) {

        return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE]
    }
    if (maxEnergy > 800) {
        return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE]
    }
}

function getHaulerComponents() {
    return [CARRY, CARRY, MOVE, CARRY, MOVE, MOVE]
}

function getBuilderComponentsByMaxEnergy(roomName) {
    let maxEnergy = Game.rooms[roomName].energyCapacityAvailable
    if (maxEnergy < 550) {
        return [WORK, CARRY, CARRY, MOVE, MOVE]
    }
    if (maxEnergy >= 550 && maxEnergy <= 800) {
        return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    }
    if (maxEnergy > 800) {
        return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    }
}

function getUpgraderComponentsByMaxEnergy(roomName) {
    let maxEnergy = Game.rooms[roomName].energyCapacityAvailable
    if (maxEnergy < 550) {
        return [WORK, CARRY, CARRY, MOVE, MOVE]
    }
    if (maxEnergy >= 550 && maxEnergy <= 800) {
        return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    }
    if (maxEnergy > 800) {
        return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    }
}

function getBuilderCountByConstructionSites(roomName) {
    var targets = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
    switch (targets) {
        case 1:
            return 1;
        case 2:
        case 3:
            return 2;
        default:
            return targets.length / 2
    }
}

function getUpgraderCountByRCLevel(roomName) {
    switch (Game.rooms[roomName].controller.level) {
        case 1:
        
        return 1;
        case 2:
        case 3:
            return 3;
        case 4:
        case 5:
            return 5;
        default:
            return 7
    }
}

function isBuilderNeeded(roomName, roleInfo) {
    let neededBuilders = getBuilderCountByConstructionSites(roomName)
    if (!areIdleBuildersPresent(roomName)) return false
    if (neededBuilders == 0) return false
    if (neededBuilders > 0 && roleInfo == undefined) return true
    return neededBuilders > roleInfo
}

function areIdleBuildersPresent(roomName) {
    let nonBuldingBuilders = Game.rooms[roomName].find(FIND_MY_CREEPS, {
        filter: function (creep) {
            return creep.memory.role == "builder" &&
                creep.memory.waitingSince > 0
        }
    })
    return nonBuldingBuilders.length == 0
}


function isUpgraderNeeded(roomName, roleInfo) {
    let neededUpgraders = getUpgraderCountByRCLevel(roomName)
    if (!areIdleUpgradersPresent(roomName)) return false
    if (neededUpgraders == 0) return false
    if (neededUpgraders > 0 && roleInfo == undefined) return true
    return neededUpgraders > roleInfo
}

function areIdleUpgradersPresent(roomName) {
    let nonUpgradingUpgraders = Game.rooms[roomName].find(FIND_MY_CREEPS, {
        filter: function (creep) {
            return creep.memory.role == "upgrader" &&
                creep.memory.waitingSince > 0
        }
    })
    return nonUpgradingUpgraders.length == 0
}



var economyControler = {

    run: function (sourceInfo, roomName) {
        let ROLEINFO = ri.get()

        let spawnNames = []
        for (let spawnName in Game.spawns) {
            spawnNames.push(spawnName)
        }

        let totalHarvesters = 0

        for (let index in sourceInfo) {
            let sourceId = sourceInfo[index].sourceId
            let plainTiles = sourceInfo[index].plainTiles
            totalHarvesters += plainTiles
            sourceInfo[index].remainingTiles = sourceInfo[index].plainTiles
            for (let creepName in Game.creeps) {
                //build info which sourcetiles are open
                if (Game.creeps[creepName].memory.role == 'harvester') {
                    let assignedSource = Game.creeps[creepName].memory.source
                    if (assignedSource == sourceId) {
                        sourceInfo[index].remainingTiles--
                    }
                }

            }
        }
        const sourceIds = cas.find(sourceInfo)
        let possibleSources = []
        sourceIds.forEach(id => {
            let source = Game.getObjectById(id)
            possibleSources.push(source)
        });
        let nextSource
        if (possibleSources.length == 1) {
            nextSource = possibleSources[0]
        } else {
            nextSource = Game.spawns["Spawn1"].pos.findClosestByPath(possibleSources)
        }
        console.log('harvesters', ROLEINFO['harvester'])
        console.log('upgrader', ROLEINFO['upgrader'])
        console.log('builder', ROLEINFO['builder'])
        console.log('repairer', ROLEINFO['repairer'])
        console.log('scout', ROLEINFO['scout'])
        console.log('hauler', ROLEINFO['hauler'])


        if (ROLEINFO['harvester'] == undefined || ROLEINFO['harvester'] < 2) {
            var newName = 'WALL-E' + Game.time;
            Game.spawns[spawnNames[0]].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'harvester', isFull: false, source: nextSource.id } });
        }

        else if (ROLEINFO['harvester'] > 2 && ((ROLEINFO['hauler'] <= ROLEINFO['harvester'] * 2) || !ROLEINFO['hauler'])) {
            var newName = 'Hauler' + Game.time;
            Game.spawns[spawnNames[0]].spawnCreep(getHaulerComponents(), newName,
                { memory: { role: 'hauler' } });
        }

        /**
         * build harvester to kick in some eco
         * harvesters have prio
        **/
        else if (ROLEINFO['harvester'] < totalHarvesters || ROLEINFO['harvester'] == undefined) {
            //adapt for multiple rooms by starting economyControler for each room in main.js / handle room overhead in separate class
            var newName = 'Harvester' + Game.time;
            Game.spawns[spawnNames[0]].spawnCreep(getHarvesterComponentsByMaxEnergy(roomName), newName,
                { memory: { role: 'harvester', isFull: false, source: nextSource.id } });
        } else {
            /*  if (ROLEINFO['scout'] < 1 || ROLEINFO['scout'] == undefined) {
                  var newName = 'Scout' + Game.time;
                  Game.spawns[spawnNames[0]].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], newName,
                      { memory: { role: 'scout', room: roomName} });
              }
            */
            //build repairer 

            if (ROLEINFO['repairer'] < 1 || ROLEINFO['repairer'] == undefined && Game.rooms[roomName].controller.level > 2) {
                var newName = 'Repairer' + Game.time;
                Game.spawns[spawnNames[0]].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'repairer' } });
            }
            //build builder
            else if (isBuilderNeeded(roomName, ROLEINFO['builder'])) {
                var newName = 'Builder' + Game.time;
                Game.spawns[spawnNames[0]].spawnCreep(getBuilderComponentsByMaxEnergy(roomName), newName,
                    { memory: { role: 'builder', building: false } });
            }
            //build upgrader
            else if (isUpgraderNeeded(roomName, ROLEINFO['upgrader'])) {
                var newName = 'Upgrader' + Game.time;
                Game.spawns[spawnNames[0]].spawnCreep(getUpgraderComponentsByMaxEnergy(roomName), newName,
                    { memory: { role: 'upgrader', waitingSince: 0 } });
            }
        }
        //console.log("builder  needed: ", isBuilderNeeded(roomName, ROLEINFO['upgrader']))
        //console.log("idle upgraders presend: ", areIdleUpgradersPresent(roomName))
    }
};

module.exports = economyControler;


