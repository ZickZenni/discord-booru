# discord-booru

This api wrapper allows you to search posts of booru websites and post them using a discord bot!

```js
const discordBooru = require('discord-booru')

// Searches on 'yande.re' for posts using tags and rating
const posts = await booru.getPosts("yandere", "genshin_impact", "rating:s");

// Gets a random post from the list before
const post = await booru.getRandomPost(posts);

// Blocks any NSFW related posts, this can be useful for NSFW text channels.
if (await booru.isNSFW(post) && !booru.isChannelNSFW(message.channel))
      // Send a message, when containing NSFW related tags
      return;
      
// Creating an embed
const embed = await booru.createEmbed(post, true);
```

### Getting an array of posts

Posts represent images on the booru website you're requesting. You can query them like this:

```
// Tags isn't needed, rating either, but can be (rating:e, rating:q | Explitic, Questionable)
const posts = await booru.getPosts(booru, tags, rating);
```

Your parameters that are currently available:

* `booru` - The booru website you're requesting
* `tags` - The tags you're searching for posts
* `rating` - The rating that is allowed to search. (rating:e, rating:q)
