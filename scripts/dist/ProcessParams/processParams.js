"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processParams(gulpParameters) {
    if (gulpParameters.length < 3) {
        return null;
    }
    var toReturn = {};
    for (var i = 3; i < gulpParameters.length; i++) {
        if (gulpParameters[i].indexOf('--') === 0) {
            var optionName = gulpParameters[i].replace(/-/g, '');
            toReturn[optionName] = "";
            if ((i + 1) < gulpParameters.length && gulpParameters[i + 1].indexOf('--') !== 0) {
                toReturn[optionName] = gulpParameters[i + 1];
            }
        }
    }
    return toReturn;
}
exports.processParams = processParams;
