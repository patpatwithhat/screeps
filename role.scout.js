let roomScanner = require('roomScanner')
var roleSocut = {

    /** @param {Creep} creep **/
    run: function (creep) {
       // if(creep.room.)
        const targets = creep.room.find(FIND_EXIT_LEFT);
        /*  if(creep.room != targets[0]) {
              const exitDir = Game.map.findExit(creep.room, targets[0]);
          }*/
        const exit = creep.pos.findClosestByPath(targets);
        creep.moveTo(exit);
        creep.say("Jeff")
    }
};

module.exports = roleSocut;