import { Router } from "express";
import * as controller from "../controllers/userController.js";
import * as url from "../controllers//urlController.js";
import Auth from "../middleware/auth.js";
import { registerMail } from "../service/sentMailer.js";

const router = Router();


router.route("/register").post(controller.register); // register user
router.route("/authenticate").post(controller.authUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); // login in app

router.route("/user/all").get(controller.getAll); // all user
router.route("/user/:username").get(controller.getUser); // user with username
router.route("/generateOTP").get(controller.generateOTP); // generate random OTP
router.route("/verifyOTP/:code").get(controller.verfiyOTP); // verify generated OTP
router.route("/resetSession").get(controller.createResetSession); // reset all the variables

router.route("/updateUser").put(Auth, controller.updateUser); // is use to update the user profile
router.route("/resetPassword").put(controller.verifyUser, controller.resetPassword); // use to reset password

router.route("/registerMail").post(registerMail); // send the email


router.route("/url").post(url.urlshortener);  //full url
router.route("/:shortId").get(url.getShortUrl);  //get short url

export default router;
