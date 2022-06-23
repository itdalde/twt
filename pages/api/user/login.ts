import { loginUser, registerBasicUser } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
    let body = {};

    if (req.method === "GET") {
        body = JSON.stringify(
            { message: "welcome to register page"}
        );
        res.status(200).json(body);
    }
    else if (req.method === "POST") {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const result = await loginUser({  username, password });
            console.log(result);
            res.status(200).json({ "message": result });
        }
        catch (e) {
            const errorMsg = e.message;
            console.error(errorMsg);
            res.status(406).json({ "message": errorMsg });
        }
    }

}
