String.prototype.splice = function (start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};
String.prototype.padding_left = function (targetLength, padString) {
    if (padString == null)
        padString = ' ';
    const len = Math.max(0, (targetLength - this.length));
    return String(padString.repeat(len).substr(0, len) + this);
};
String.prototype.padding_right = function (targetLength, padString) {
    if (padString == null)
        padString = ' ';
    const len = Math.max(0, (targetLength - this.length));
    return String(this + padString.repeat(len).substr(0, len));
};
