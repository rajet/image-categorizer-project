/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

//export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
//});

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const firestore = admin.firestore();

interface Category {
    approval: boolean;
    category: string;
    email: string;
    img: string;
}

// Function to get all user emails from Authentication
async function getAllUserEmails() {
    try {
        const userRecords = await admin.auth().listUsers();
        return userRecords.users.map((user) => user.email);
    } catch (error) {
        console.error('Error listing users:', error);
        throw new Error('Error listing users');
    }
}

// Function to calculate statistics for all categories
async function calcAllCategoriesData() {
    try {
        const categoriesCollection = firestore.collection('categories');
        const snapshot = await categoriesCollection.get();

        let totalGuesses = 0;
        let totalApprovalsTrue = 0;
        let totalApprovalsFalse = 0;

        snapshot.forEach((doc) => {
            const categoryData = doc.data() as Category;
            totalGuesses++;
            if (categoryData.approval === true) {
                totalApprovalsTrue++;
            } else if (categoryData.approval === false) {
                totalApprovalsFalse++;
            }
        });

        return {
            totalGuesses,
            totalApprovalsTrue,
            totalApprovalsFalse,
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Error fetching categories');
    }
}

// Function to calculate user-specific category statistics
async function calcUserSpecificCategoriesData(userEmail: string) {
    try {
        const categoriesCollection = firestore.collection('categories');
        const snapshot = await categoriesCollection.where('email', '==', userEmail).get();

        let totalUserGuesses = 0;
        let totalUserApprovalsTrue = 0;
        let totalUserApprovalsFalse = 0;

        snapshot.forEach((doc) => {
            const categoryData = doc.data() as Category;
            totalUserGuesses++;
            if (categoryData.approval === true) {
                totalUserApprovalsTrue++;
            } else if (categoryData.approval === false) {
                totalUserApprovalsFalse++;
            }
        });

        return {
            totalUserGuesses,
            totalUserApprovalsTrue,
            totalUserApprovalsFalse,
        };
    } catch (error) {
        console.error('Error fetching user-specific categories:', error);
        throw new Error('Error fetching user-specific categories');
    }
}

// Cloud Function to send daily summary emails
export const sendMail = functions.pubsub
    //Currently every 5 Minutes
    .schedule('*/5 * * * *')
    .onRun(async () => {
        try {
            const emails = await getAllUserEmails();
            const totalCategoriesData = await calcAllCategoriesData();

            for (const userEmail of emails) {
                if (userEmail) {
                    const userSpecificCategoriesData = await calcUserSpecificCategoriesData(userEmail);
                    const {
                        totalGuesses,
                        totalApprovalsTrue,
                        totalApprovalsFalse,
                    } = totalCategoriesData;
                    const {
                        totalUserGuesses,
                        totalUserApprovalsTrue,
                        totalUserApprovalsFalse,
                    } = userSpecificCategoriesData;

                    await firestore.collection("mail").add({
                        to: userEmail,
                        message: {
                            subject: "Daily Summary",
                            html: `
                                <h1>Hey! 👋</h1>
                                <br>
                                <p>Here are all the category statistics:</p>
                                <ul>
                                    <li>Total Guesses: ${totalGuesses}</li>
                                    <li>Approvals: ${totalApprovalsTrue}</li>
                                    <li>Disapprovals: ${totalApprovalsFalse}</li>
                                </ul>  
                                <br>
                                <br>
                                <p>Here are your personal category statistics:</p>
                                <ul>
                                    <li>Total Guesses: ${totalUserGuesses}</li>
                                    <li>Approvals: ${totalUserApprovalsTrue}</li>
                                    <li>Disapprovals: ${totalUserApprovalsFalse}</li>
                                </ul>  
                                <br>
                                <p>Regards, The Image Categorizer Team</p>
                            `,
                        },
                    });
                }
            }
            console.log('Emails sent successfully.');
            return null;
        } catch (error) {
            console.error('Error sending emails:', error);
            throw new Error('Error sending emails');
        }
    });