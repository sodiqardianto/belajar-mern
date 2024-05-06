import type { UserAttributes } from "../interface/UserInterface";
import Users from "../models/UserModel";
import argon2 from 'argon2';

export const getUsers = async (req: any, res: any) => {
    try {
        const respone = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });

        res.status(200).json(respone);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const getUsersById = async (req: any, res: any) => {
    try {
        const respone = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        }) as UserAttributes | null;

        res.status(200).json(respone);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async (req: any, res: any) => {
    const {name, email, password, confirmPassword, role}: UserAttributes = req.body;
    
    if (password !== confirmPassword) return res.status(400).json({
        msg: "Password and confirm password do not match."
    })
    const hashedPassword = await argon2.hash(password);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })
        res.status(201).json({msg: "Registration success."})
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}


export const updateUser = async (req: any, res: any) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    }) as UserAttributes | null;

    if (!user) return res.status(404).json({
        msg: "User not found."
    })

    const { name, email, password, confirmPassword, role } = req.body;

    let hashedPassword;
    if (password === "" || password === null) {
        hashedPassword = user.password;
    } else {
        hashedPassword = await argon2.hash(password);
    }
    
    if (password !== confirmPassword) return res.status(400).json({
        msg: "Password and confirm password do not match."
    })

    try {
        await Users.update({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        })
        res.status(201).json({msg: "User updated."})
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}

export const deleteUser = async (req: any, res: any) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    }) as UserAttributes | null;

    if (!user) return res.status(404).json({
        msg: "User not found."
    })

    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        })
        res.status(201).json({msg: "User deleted."})
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}