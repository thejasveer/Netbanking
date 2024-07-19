"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proccessTxn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _1 = require(".");
const client_1 = __importDefault(require("@repo/db/client"));
const client_2 = require("@prisma/client");
const proccessTxn = async (token) => {
    console.log(token);
    try {
        //verify token 
        try {
            const payload = await new Promise((resolve, reject) => {
                if (!_1.SECRET)
                    return;
                jsonwebtoken_1.default.verify(token, _1.SECRET, (err, payload) => {
                    if (payload) {
                        resolve(payload);
                    }
                    else {
                        throw new Error(err);
                    }
                });
            });
            console.log(payload);
        }
        catch (error) {
            console.log(error);
        }
        //update transaction
        try {
            await client_1.default.$transaction(async (tx) => {
                const transaction = await client_1.default.transaction.update({
                    where: {
                        token: token
                    },
                    data: {
                        status: client_2.PaymentStatus.SUCCESS
                    },
                    select: {
                        userBank: true
                    }
                });
                console.log(transaction.userBank);
            });
        }
        catch (error) {
        }
    }
    catch (error) {
        console.log(error);
    }
    // inform webhook
    // Here you would add your actual processing logic
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing.`);
};
exports.proccessTxn = proccessTxn;
