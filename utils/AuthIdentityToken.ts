import Token from "../models/Tokens"

const SaveToken = async (sessionToken: string, forId: string) =>{
    try {
        const entry = await Token.findOne({for: forId})
        console.log("Found", entry)
        if(entry){
            await Token.updateOne({_id: entry._id}, {$set: {token: sessionToken}})
            return 
        }
        await new Token({
            token: sessionToken, 
            for: forId, 
            blocked: false
        }).save();
        return 
    } catch (err) {
        console.error(err)
    }
}
const VerifyToken = async (JWT: {
    "sess": string,
    "did": string,
    "iat": number,
    "exp": number
})=>{
    try {
        var session = await Token.findOne({for: JWT.did, token: JWT.sess})
        if(session) return true
        return false
    } catch (err) {
        console.error(err)
    }
}

export {SaveToken, VerifyToken}