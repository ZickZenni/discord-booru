module.exports = class BaseBooru {
    constructor(name, containsNSFW, onlyNSFWPosts, nsfwtags) {
      this.name = name;
      this.containsNSFW = containsNSFW;
      this.onlyNSFWPosts = onlyNSFWPosts;
      this.nsfwtags = nsfwtags;
    }
  }