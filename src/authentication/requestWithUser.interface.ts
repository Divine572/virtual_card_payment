import { Request } from "express";
import { User, UserDocument } from "src/users/user.schema";


export default interface RequestWithUser extends Request {
    user: UserDocument
}


