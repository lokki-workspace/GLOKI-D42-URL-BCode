import jwt from "jsonwebtoken";


export default async function Auth(req, res, next) {

  try {
    // access authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    // retrive the user deatils of the logged  in user
    const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedToken)
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Authentication Faild" });
  }
}

export function localVariable(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
