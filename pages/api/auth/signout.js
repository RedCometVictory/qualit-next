import nc from "next-connect";
import cookie from 'cookie';
import { onError, onNoMatch } from '@/utils/ncOptions';

const handler = nc({onError, onNoMatch});

handler.post(async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    [
      cookie.serialize("qual__token", '', {
        sameSite: "Strict",
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }),
      cookie.serialize("qual__isLoggedIn", '', {
        sameSite: "Strict",
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }), 
    ]
  );
  res.status(200).send({ "success": "Logged out successfully!" });
});
export default handler;