var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer')
var roleScout = require('role.scout')
var roleHauler = require('role.hauler')
var economyControler = require('economyController')
var deathHandler = require('deathHandler')
var roomScanner = require('roomScanner')
var haulerController = require('haulerController')

function placeIdleFlag(room) {
    let x = room.controller.pos.x + 3
    let y = room.controller.pos.y + 3
    const pos = new RoomPosition(x, y, room.name);
    pos.createFlag('idleFlag')
}

module.exports.loop = function () {
    deathHandler.run()

    for (let roomName in Game.rooms) {
        const exits = Game.map.describeExits(roomName);
        let sourceInfo = roomScanner.getSourceInfo(Game.rooms[roomName])
        roomScanner.getLocationOfDroppedRes(Game.rooms[roomName])
        placeIdleFlag(Game.rooms[roomName])
        haulerController.assignAllDropPositionsToHaulers(Game.rooms[roomName])
        economyControler.run(sourceInfo, roomName, exits);
    }

    const towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    for (let index in towers) {
        
        let tower = towers[index]

        var closestHostile = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
       /* var closestDamagedStructure = tower.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }*/

    
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep)
        }
        if (creep.memory.role == 'scout') {
            roleScout.run(creep)
        }
        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep)
        }
    }
}