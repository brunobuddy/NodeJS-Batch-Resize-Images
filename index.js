const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const mime = require('mime-types')

const inputDirectoryPath = path.join(__dirname, 'images/input')
const outputDirectoryPath = path.join(__dirname, 'images/output')

fs.readdir(inputDirectoryPath, function(err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }

  files.forEach(function(file) {
    const image = sharp(inputDirectoryPath + '/' + file)
    const fileMimeType = mime.lookup(inputDirectoryPath + '/' + file)

    if (fileMimeType && fileMimeType.includes('image')) {
      image
        .metadata()
        .then(metadata => {
          const fileSizeInKilobytes =
            fs.statSync(inputDirectoryPath + '/' + file).size / 1000.0

          // We only resize files bigger than 250kb
          if (fileSizeInKilobytes > 250) {
            image
              // We resize to a 1000px width
              .resize({ width: 1000 })
              .toBuffer()
              .then(data => {
                fs.writeFileSync(outputDirectoryPath + '/' + file, data)
              })
              .catch(err => {
                throw err
              })
          } else {
            fs.copyFile(
              inputDirectoryPath + '/' + file,
              outputDirectoryPath + '/' + file,
              err => {
                if (err) throw err
              }
            )
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
})
