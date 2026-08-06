import { OTPs } from "@/types/databaseTypes";
// import { mongoServer } from "./mongoServer";
import { bcryptHash } from "@/lib/bcrypt";
import { timingsInMinutes } from "@/lib/time";
import { mongoCollection } from "./operations";

export const createOtp = async (
    otp: string,
    username: string,
    purpose: OTPs['purpose'],
): Promise<Status>=>{
    try {
        const otps = mongoCollection("Otps")?.collection!;
        // const db = mongoServer.db('E-Learning');
        // const otps = db.collection<OTPs>('otps');

        // Getting Hashed OTP
        const otpHashed = (await bcryptHash(otp)).hashed ;
        
        // If it fails to hash
        if(!otpHashed) return {
            status: false,
            message: "Couldn't generate OTP"
        }

        const now = Date.now();

        // OTP document to insert
        const otpDocument: OTPs = {
            otp: otpHashed,
            username: username,
            purpose: purpose,
            issuedAt: new Date(now),
            expiresAt: new Date(
                now + timingsInMinutes.opts * 60 * 1000
            )
        }

        // Inserting the document
        const res = await otps.insertOne(otpDocument);

        // If insertion failes
        if(!res.acknowledged) return {
            status: false,
            message: "Couldn't save the OTP"
        }
        
        return {
            status: true,
            message: "OTP saved in DB",
            otp: {
                purpose: otpDocument.purpose,
                // in integer
                expiresAt: otpDocument.expiresAt.getTime(),
            }
        }

    } catch (error: any) {
        return{
            status: false,
            error: error.message
        }
    }
    
}

export const findOtp = async (
    username: string,
    purpose: OTPs['purpose'],
): Promise<Status>=>{
    try {
        // const db = mongoServer.db('E-Learning');
        // const otps = db.collection<OTPs>('otps');
        const otps = mongoCollection("Otps")?.collection!;

        // Finding OTP
        const res = await otps.findOne({
            username, purpose
        })

        // If specified OTP not found!
        if(!res) return {
            status: false,
            message: "OTP not found!"
        }

        return {
            status: true,
            message: "OTP Verified!",
            otp: {
                hashedOtp: res.otp,
                purpose: res.purpose,
                // in integer
                expiresAt: res.expiresAt.getTime()
            }
        }

    } catch (error: any) {
        return{
            status: false,
            error: error.message
        }
    }
    
}

export const deleteOtp = async (
    username: string,
    purpose: OTPs['purpose']
): Promise<Status>=>{
    try {
        // const db = mongoServer.db('E-Learning');
        // const otps = db.collection<OTPs>('otps');
        const otps = mongoCollection("Otps")?.collection!;

        const res = await otps.deleteOne({
            username, purpose
        });

        if(!res.acknowledged) throw new Error("Couldn't delete OTP");

        return {
            status: true,
            message: "OTP deleted successfully"
        }
    } catch (error:any) {
        return {
            status: false,
            error: error.message
        }
    }
}
export const generateOTP = (length: number)=>{
    let otp = '';
    let iteration = 0;
    while(iteration<length){
        otp = otp + Math.floor(Math.random()*10);
        iteration++;
    }
    console.log(otp)
    return otp
}