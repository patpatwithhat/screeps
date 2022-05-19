
var haulerController = {

    assignAllDropPositionsToHaulers: function (room) {
        Memory.rooms[room].droppedResources.forEach(res => {
            if (res.haulerId == undefined) {
                let haulers = room.find(FIND_MY_CREEPS, {
                    filter: (myCreep) => {
                        return myCreep.memory.role == "hauler" &&
                            myCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            myCreep.memory.updatedAt != Game.time;
                    }
                })
                let closestHauler = res.pos.findClosestByPath(haulers)
                if (!closestHauler) return
                closestHauler.memory.droppedResPosition = res.id
                closestHauler.memory.updatedAt = Game.time
                res.hauler = closestHauler.id
            }
        })
    }
}

module.exports = haulerController 