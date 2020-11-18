// Error handling
function errorMessage(err) {
    this.name = 'error';
    this.err = err || 'No message';
    this.stack = (new Error()).stack;
}
errorMessage.prototype = Object.create(Error.prototype);
errorMessage.prototype.constructor = errorMessage;

module.exports.errorMessage = errorMessage;