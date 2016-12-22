const $ = require('jquery')(require("jsdom").jsdom().defaultView)
const https = require('https')
const notifier = require('node-notifier')
const opener = require('opener')
const path = require('path')
const fs = require('fs')

let globalCacheDate = fs.readFileSync('db.znf')

const getDate = new Promise((resolve, reject) => {
  https.get('https://www3.reg.cmu.ac.th/transcript/index.php', (res) => {
    let htmlData = '';
    res.on('data', (chunk) => htmlData += chunk)
    res.on('end', () => {
      $('html').append(htmlData)
      resolve($('#update-at').html())
    })
  })
  .on('error', (e) => reject(e))
})

const checkDate = () => {
  getDate.then((date) => {
    if(date !== globalCacheDate) {
      globalCacheDate = date
      fs.writeFileSync('db.znf', date)
      notifier.notify({
        title: 'CMU Grade Update !!',
        message: date,
        icon: path.join(__dirname, 'cmu.png'),
        sound: true,
        wait: true
      });
      notifier.on('click', function (notifierObject, options) {
        opener('https://www3.reg.cmu.ac.th/transcript/index.php')
      });
    }
    setTimeout(checkDate, 600000)
  })
}
// globalCacheDate = 'abc'
checkDate()