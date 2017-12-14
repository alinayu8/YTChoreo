//Is this model necessary though
function User() {
    this.username = '';
    this.project = '';
}

User.prototype.getUser = function(name) {
    this.username = name;
    return this.username;
}

User.prototype.getUserName = function() {
    return this.username;
}

User.prototype.getProject = function(project) {
    this.project = project;
    return this.project;
}

module.exports = User;
