import type { UserAttributes } from "../interface/UserInterface";
import Users from "../models/UserModel";

export const verifyUser = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
        return res.status(401).json({
            msg: "Unauthorized."
        });
    }
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    }) as UserAttributes | null;

    if (!user) return res.status(404).json({
        msg: "User not found."
    });

    req.userId = user.id;
    req.role = user.role;
    next();
}

export const adminOnly = async (req: any, res: any, next: any) => {
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    }) as UserAttributes | null;

    if (!user) return res.status(404).json({
        msg: "User not found."
    });

    if (user.role !== "ADMIN") return res.status(403).json({
        msg: "You do not have permission to perform this action."
    });
    next();
}