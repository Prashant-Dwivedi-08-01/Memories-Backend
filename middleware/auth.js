import jwt, { decode } from "jsonwebtoken";
/*
? Note: Here if the user is valid then we are setting the "userId" inside the body of req! Now wherever,
?       this auth is applied as middleware there we will be having req.userId and using this we will 
?       then decide inside that controller whether the user is logged in or not.
*/

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const isNotGoogleAuth = token.length < 500;

        let decodedData; //? This is the data which we have set when we made the jwt token in signin/signup

        if (token && isNotGoogleAuth) {
            decodedData = jwt.verify(token, 'test');
            
            req.userId = decodedData?.id; //? from here we are sending user id in body
        }
        else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();

    } catch (error) {
        console.log(error);
    }
}
export default auth;