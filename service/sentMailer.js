import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// let nodeConfig = {
//   host: process.env.HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: Boolean(process.env.SECURE), 
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAILPASSWORD, 
//   },
// };

// let transporter = nodemailer.createTransport(nodeConfig);

// let MailGenerator = new Mailgen({
//   theme: "default",
//   product: {
//     name: "Mailgen",
//     link: "https://mailgen.js/",
//   },
// });

// /** POST: http://localhost:8080/api/registerMail 
//  * @param: {
//   "username" : "example123",
//   "userEmail" : "admin123",
//   "text" : "",
//   "subject" : "",
// }
// */
// export const registerMail = async (req, res) => {
//   const { username, userEmail, text, subject } = req.body;

//   console.log(username, userEmail, text, subject);
//   // body of the email
//   var email = {
//     body: {
//       name: username,
//       intro: text || "Welcome to recover the password ",
//       outro:
//         "Need help, or have questions? Just reply to this email, we'd love to help.",
//     },
//   };
// console.log(email)
//   var emailBody = MailGenerator.generate(email);
//   console.log(emailBody)
//   let message = {
//     from: ENV.EMAIL,
//     to: userEmail,
//     subject: subject || "Signup Successful",
//     html: emailBody,
//   };
//   console.log(message)
//   // send mail
//   transporter
//     .sendMail(message)
//     .then(() => {
//       return res
//         .status(200)
//         .send({ msg: "You should receive an email from us." });
//     })
//     .catch((error) => res.status(500).send({ error }));
// };


export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAILPASSWORD,
			},
		});

    var email = {
          body: {
            name: username,
            intro: text || "Welcome to recover the password ",
            outro:
              "Need help, or have questions? Just reply to this email, we'd love to help.",
          },
        };

		await transporter.registerMail({
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: email,
		});
    
    res.status(200).send({ msg: "You should receive an email from us." })
	} catch (error) {
		res.status(500).send({ error })
	}
};

