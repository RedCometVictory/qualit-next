import nc from "next-connect";
import cookie from 'cookie';
import { onError, onNoMatch } from '@/utils/ncOptions';

const handler = nc({onError, onNoMatch});
// *** Insomnia tested - passed
handler.post(async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    // cookie.serialize("ual__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
    cookie.serialize("qual__token", '', {
      sameSite: "strict",
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1,
      path: '/',
      httpOnly: true,
      expires: new Date(0)
    })
  );
  res.cookie('qual__isLoggedIn', '', { expires: new Date(1) });
  res.status(200).send({ "success": "Logged out successfully!" });
});
export default handler;