const checkAvatarFile = (req, res, next) => {
    const {avatarName} = req.body
    if (!avatarName) {
      return res.status(400).send("avatarName is required")
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const fileExtension = avatarName.substring(avatarName.lastIndexOf('.'));    
    if (!imageExtensions.includes(fileExtension)) {
        return res.status(400).send('Invalid image file extension')
    }
    next()
}

module.exports = checkAvatarFile