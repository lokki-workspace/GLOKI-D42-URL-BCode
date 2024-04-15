import express from "express";

const router = express.Router();

//API connection
router.get("/", async (req, res)=>{
    try {

        const htmlContent = `
        <html>
            <head>
                <title>Welcome to Mentor and Student Assigning</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color:black;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        text-align: center;
                    }
                    h1,h3 {
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>URL Shortner API Connected Successfully! </h1>
                    <h3>Kindly test the API in Postman.</h3>
                  <h2>😊</h2>
                <div style="display:flex; justify-content:center;padding:20px;"> 
                <div> 
                <p style="color:white;background-color:#a10308; padding:10px 80px; margin:30px 20px; text-align:center ">
                  <a href="/" style="text-decoration:none;color:white;">Home</a>
                </p>
                <p style="color:white;background-color:#014504; padding:10px 80px; margin:10px 20px; text-align:center ">
                <a href="/api/user/all"  style="text-decoration:none;color:white;">All Stored Users</a></p>

                </div>
                </div>
                </div>
            </body>
        </html>
    `;
        //sending success response
        // await res.status(200).json({message : `User Password Reset API Connected Successfully! Kindly test the API in Postman`});
        await res.status(200).send(htmlContent);
    } catch (error) {

        //throw error if anything goes wrong
        console.log(`There is a error while connecting to API : ${error}`);
        res.status(500).json({message : `Internal Server Error`});
    }
})

export const apiConnected = router;