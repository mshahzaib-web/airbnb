# <<================== Passport npm package ===========================>>

# User.register(newUser, password);
This method is use to store new user in database and alos check new user is already store in database with the username not by email. If username is not exits then store new user in database.

# passport.authenticate
When user want to login this method check that user is exist in database if not exits show error if exist then user can login.

# req.logout
This method is use to logout the user.

# req.login
This method automatically redirect on login after signup. This method use in signup route.

# rea.isAuthenticated
This method use when user create new listing this method check that this user login or not.

# req.originalUrl
To access the url where user want to go.after click


# <<================== Upload file from form ===========================>>

# Requirement for upload file
install npm pacakage multer
Then
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
dest is location where we save image like cloude platform like cloudinary
set enctype="multipart/form-data" in the form
router.post("/", upload.single("listing[image][url]"), (req, res) => {
  res.send(req.file);
});