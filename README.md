# discord-booru

This api wrapper allows you to search posts of booru websites and post them using a discord bot!

```js
const booru = require('discord-booru');

// Searches on "yande.re" for posts
const posts = await booru.getPosts("yandere", ["genshin_impact], { limit: 200, rating: "s"});

// Check if theres a error
if (booru.isErrorMessage(posts)) {
    // Get error message as string
    const errorMessage = booru.getErrorMessage(posts);
	
	// Gotten error
    return;
}

// Gets a random post from the list before
const post = await booru.getRandomPost(posts);

// Blocks any NSFW only boorus
if (await booru.onlyNSFWPosts("yandere") {
    return;
}

// Blocks any NSFW containable boorus
if (await booru.containsNSFWPosts("yandere") {
    return;
}

// Blocks any NSFW related posts, this can be useful for SFW only text channels.
if (await booru.isNSFW(post) && !booru.isChannelNSFW(%channel%))
    // Send a message, when post is NSFW or containing NSFW tags
    return;
      
// Creating an embed
const embed = await booru.createEmbed(post, true);
```

### Current list

This package is kinda new, so there's only a few of boorus available and these are:

* `hypnohub` - Contains NSFW
* `konachan` - Contains NSFW
* `lolibooru` - Contains NSFW
* `yandere` - Contains NSFW
* `rule34` - Only NSFW
* `safebooru` - Safe

### Getting an array of posts

Posts represent images on the booru website you're requesting. You can query them like this:

```js
const posts = await booru.getPosts(%booruName%, %tagsInArray%, { limit: %limit%, rating: %rating%});
```

Your parameters that are currently available:

* `booru` - The booru website you're requesting (String)
* `tags` - The tags you're searching for posts (Array)
* `limit` - The amount of posts you're getting, higher = slower (Number/int)
* `rating` - The rating that is allowed to search. [e, q | Explitic, Questionable] (String)

### Checking if there's an error

If you're requests posts, there is sometimes a error. Error can be found like this:

```js
if (booru.isErrorMessage(posts)) {
    // Get error message as string
    const errorMessage = booru.getErrorMessage(posts);
	
	// Gotten error
    return;
}
```

Your parameters that are currently available:

* `posts` - The posts you got requested (Array)

### Getting a random post

Now you have you're requested posts. You can get a random post like this:

```js
const post = await booru.getRandomPost(posts);
```

Your parameters that are currently available:

* `posts` - The posts you got requested (Array)

### Blocking NSFW stuff

This package contains boorus, that have NSFW related posts. If you want to get rid of these, this is how:

```js
// Blocks any NSFW only boorus
if (await booru.onlyNSFWPosts(%booru%) {
    // Booru only has NSFW stuff
    return;
}

// Blocks any NSFW containable boorus
if (await booru.containsNSFWPosts(%booru%) {
    // Booru has NSFW stuff
    return;
}

// Blocks any NSFW related posts, this can be useful for SFW only text channels.
if (await booru.isNSFW(post) && !booru.isChannelNSFW(%channel%))
    // Post has NSFW stuff
    return;
```

Your parameters that are currently available:

* `booru` - The booru you got you're posts requested (String)
* `post` - The post you got by using getRandomPost (Post/JSON)
* `channel` - The text channel you want to post it into (Discord.js Channel)

### Turning your post into an Embed

Now you finally got your post without any NSFW stuff, it's time to post it. This is how:

```js
const embed = await booru.createEmbed(post, %showSource%, { color: %color%, title: %title%, description: %description%, footer: %footer%});
```

Your parameters that are currently available:

* `post` - The final post (Post/JSON)
* `showSource` - If you want to show the source (Boolean)
* `color` - The hex color you want your embed to have (String) ["#03f8fc"]
* `title` - The embed title you want to have (String)
* `description` - The embed description you want to have (String)
* `footer` - The embed footer text you want to have (String)

### Updates

If you want to check for an update, when starting your discord bot, this is how:

```js
// Getting the update version as a variable, when available
const updateVersion = booru.checkUpdate(false);

// Logging to console, when available
booru.checkUpdate(true);
```

### Bugs & Crashes

If you find any bugs or crashes, when using my package, please report it under
https://github.com/ZickZenni/discord-booru/issues

Thank you!
