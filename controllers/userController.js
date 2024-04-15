import UserModel from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/user.js";
import otpGenerator from "otp-generator";

/*middleware for verify user*/
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    // check the user existance
    let exist = await userModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user" });
    
    next();
    console.log("done")
  } catch (error) {
    return res.status(404).send({ error: "Authentication error" });
  }
}


export async function authUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    // check the user existance
    let exist = await userModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user" });
    else{res.status(200).send({ message: "User find successfull" })}
    next();
    console.log("done")
  } catch (error) {
    return res.status(404).send({ error: "Authentication error" });
  }
}


export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    const existUsername = UserModel.findOne({ username }).exec();

    const existEmail = UserModel.findOne({ email }).exec();

    Promise.all([existUsername, existEmail])
      .then(([existingUsernameUser, existingEmailUser]) => {
        if (existingUsernameUser) {
          return res.status(400).send({ error: "Please use a unique username" });
        }
        if (existingEmailUser) {
          return res.status(400).send({ error: "Please use a unique email" });
        }

        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });

              user.save().then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) =>
                  res.status(500).send({ error: "Unable to register" })
                );
            })
            .catch((error) => {
              return res.status(500).send({ error: "Unable to hash password" });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error: "REGISTER ERROR" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    await UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have Password" });
            // create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not Match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not Found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function getAll(req, res) {
  try{
    const user = await UserModel.find();
    const userData = user.map(user => ({
      _id : user._id,
      name: user.username,
      email: user.email,
      password: user.password
  }));
res.status(200).json({message : `All User lists`, allusers : userData});
  }
  catch (error) {
    console.log(`There is a error while connecting to API : ${error}`);
    res.status(500).json({message : `Internal Server Error`});
}
}

export async function getUser(req, res) {
  const { username } = req.params;

  if (!username) {
    return res.status(400).send({ error: "Invalid Username" });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User Not Found" });
    }

    // Remove sensitive data like password before sending the response
    const { password, ...rest } = user.toObject(); // Using toObject() for better serialization
    return res.status(200).send(rest);
  } catch (error) {
    console.error("Error while fetching user:", error); // Log the error for debugging
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/*PUT :http://localhost:8000/api/updateUser
 @param:{
  "header":"<token>"
 }
 body:{
  firstName:"",
  address:"",
  profile:""

 }
*/
export async function updateUser(req, res) {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    console.log(userId);
    if (userId) {
      const body = req.body;

      // Update the data using promises
      await UserModel.updateOne({ _id: userId }, body);

      return res
        .status(200)
        .send({ message: "Updated the User Data Successfully..!" });
    } else {
      return res.status(401).send({ error: "User Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

//GET :http://localhost:8000/api/generateOTP
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
  return req.app.locals.OTP;
}

// GET :http://localhost:8000/api/verifyOTP
export async function verfiyOTP(req, res) {
  const codeOTP  = req.params.code;
  console.log(codeOTP)
  var reqOTP = req.app.locals.OTP;
  console.log(reqOTP)
  if (reqOTP === codeOTP) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ message: "Verify Successfully...!" });
  }
  return res.status(400).send({ error: "Invaild OTP" });
}

// successfully redirect user when OTP is vaild
// GET :http://localhost:8000/api/createResetSession
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ message: req.app.locals.resetSession });
  }
  return res.status(400).send({ error: "Session Expired" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;
    console.log(password);

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not Found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false; // reset session
    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
}
