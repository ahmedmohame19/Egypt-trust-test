import JWT from "jsonwebtoken";

import { ErrorCatch } from "../utils/ErrorCatch.js";
import { User } from "../../DB/models/User/User.js";

export const CheckToken = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email, role } = JWT.verify(token, process.env.secretkey);
    const user = await User.findOne({ email });
    if (!user) return res.json({ Message: "User not found", status: false })
    
    req.user = user
    req.userRole = role
    next();
});

export const CheckAdmin = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email } = JWT.verify(token, process.env.secretkey);

    const checkAdmin = await User.findOne({ email, role: "Admin" });

    if (!checkAdmin) return res.json({ Message: "Only Admin allowed", status: false })

    req.user = checkAdmin
    next();
})

export const CheckWarehouseAdmin = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email } = JWT.verify(token, process.env.secretkey);

    const checkWarehouseAdmin = await User.findOne({ email, role: "WarehouseAdmin" });

    if (!checkWarehouseAdmin) return res.json({ Message: "Only Warehouse Admin allowed", status: false })

    req.user = checkWarehouseAdmin
    next();
})

export const CheckBranchAdmin = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email } = JWT.verify(token, process.env.secretkey);

    const checkBranchAdmin = await User.findOne({ email, role: "BranchAdmin" });

    if (!checkBranchAdmin) return res.json({ Message: "Only Branch Admin allowed", status: false })

    req.user = checkBranchAdmin
    next();
})

export const CheckAdminOrWarehouseAdmin = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email } = JWT.verify(token, process.env.secretkey);

    const checkUser = await User.findOne({ 
        email, 
        role: { $in: ["Admin", "WarehouseAdmin"] } 
    });

    if (!checkUser) return res.json({ Message: "Only Admin or Warehouse Admin allowed", status: false })

    req.user = checkUser
    next();
})

export const CheckAdminOrBranchAdmin = ErrorCatch(async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization || !authorization.startsWith(process.env.Bearerkey)) {
        return res.json({ Message: "Authorization header missing or invalid format", status: false })
    }

    const token = authorization.replace(process.env.Bearerkey, '')
    const { email } = JWT.verify(token, process.env.secretkey);

    const checkUser = await User.findOne({ 
        email, 
        role: { $in: ["Admin", "BranchAdmin"] } 
    });

    if (!checkUser) return res.json({ Message: "Only Admin or Branch Admin allowed", status: false })

    req.user = checkUser
    next();
}) 