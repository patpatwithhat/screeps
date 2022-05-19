var roomScanner = {
    /**
     * @param {Room} room 
     * @returns result[{"sourceId", "plainTiles"}]
     * check the room for its sources and find, how many open tiles are around
     **/
    getSourceInfo: function (room) {
        let maxEnergy = room.energyCapacityAvailable
        let sources = room.find(FIND_SOURCES);
        let result = []
        sources.forEach(source => {
            let areaAroundSource = room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
            let plainTiles = 0
            for (let index in areaAroundSource) {
                let tile = areaAroundSource[index]
                if (tile["type"] == 'terrain' && tile["terrain"] == 'plain') {
                    plainTiles++
                }
                //if harvesters are advanced enough, more than 2 harvesters mine the patch to fast
                if (maxEnergy > 500 && plainTiles >= 2) {
                    plainTiles = 2
                }
            }
            result.push({ "sourceId": source.id, "plainTiles": plainTiles })
        })
        return result
    },
    /**
     * Scan all patches and count possible harvesting positions
     * @param {Room} room 
     */
    getMaxHarvesterCount: function (room) {
        let maxEnergy = room.energyCapacityAvailable
        let sources = room.find(FIND_SOURCES);
        let possbileHarvesters = 0
        sources.forEach(source => {
            possbileHarvesters = 0
            let areaAroundSource = room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
            for (let index in areaAroundSource) {
                let tile = areaAroundSource[index]
                if (tile["type"] == 'terrain' && tile["terrain"] == 'plain') {
                    possbileHarvesters++
                }
                //if harvesters are advanced enough, more than 2 harvesters mine the patch to fast
                if (maxEnergy > 500 && possbileHarvesters >= 2) {
                    possbileHarvesters = 2
                }
            }
        })
        return possbileHarvesters
    },
    /**
     * Scan all patches and count possible harvesting positions
     * @param {Room} room 
     */
    getLocationOfDroppedRes: function (room) {
        let droppedRes = room.find(FIND_DROPPED_RESOURCES)

        let ressources = []
        droppedRes.forEach(res => {
            ressources.push({ "id": res.id, "pos": res.pos })
        })
        Memory.rooms = Game.rooms
        Memory.rooms[room] = room
        room.droppedResources = ressources
    }
};

module.exports = roomScanner;