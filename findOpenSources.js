var openSourcesFinder = {

    find: function (sourceInfo) {
        let possibleTargets = []
        for (let index in sourceInfo) {
            let remainingTiles = sourceInfo[index].remainingTiles
            if (remainingTiles > 0) {
                possibleTargets[index] = sourceInfo[index].sourceId
                continue
            }
        }
        return possibleTargets

    }
}
module.exports = openSourcesFinder;