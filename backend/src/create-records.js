const Tweet = require('./models/tweet.js')
const User = require('./models/user.js')
const colors = require('colors')
const { tweetService, userService } = require('./services')
const printTweetHistory = require('./lib/print-booking-history')

const main = async () => {
  try {
    const cihat = User.create({
      name: 'Cihat Salik',
      handle: '@chtslk',
      email: 'chtslk@twitter.com'
    })
    const sevket = User.create({
      name: 'Şevket Dayı',
      handle: '@svkdy',
      email: 'sevketdayi@twitter.com'
    })

    const tweet1 = Tweet.create({
      body: 'This is a first tweet.',
      author: cihat
    })
    const tweet2 = Tweet.create({
      body: 'this is a second tweet.',
      author: sevket
    })

    cihat.tweet(tweet1)
    sevket.tweet(tweet2)

    cihat.retweet(tweet2, 'This is a retweet.')
    sevket.retweet(tweet1, 'This is a retweet.')

    cihat.like(tweet2)
    sevket.like(tweet1)

    await userService.save([cihat, sevket])
    await tweetService.save([tweet1, tweet2])

    const ahmet = User.create({
      name: 'Ahmet',
      handle: '@ahmtylmz',
      email: 'ahmetyılmaz@twitter.com'
    })

    const mehmet = User.create({
      name: 'Mehmet',
      handle: '@mehmetylmz',
      email: 'mehmetyılmaz@twitter.com'
    })

    await userService.insert(ahmet)
    await userService.insert(mehmet)

    const users = await userService.load()
    users.forEach(printTweetHistory)
  } catch (e) {
    console.log(e)
  }
}
main()
