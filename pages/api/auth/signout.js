import nc from "next-connect";
import cookie from 'cookie';
import { onError, onNoMatch } from '@/utils/ncOptions';

const handler = nc({onError, onNoMatch});
// *** Insomnia tested - passed
handler.post(async (req, res) => {
  console.log("33333333333333333333333333333333333")
  console.log("33333333333333333333333333333333333")
  console.log("before cookie removal")
  console.log("33333333333333333333333333333333333")
  console.log("33333333333333333333333333333333333")
  // res.setHeader(
  //   "Set-Cookie",
  //   // cookie.serialize("ual__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
  //   cookie.serialize("qual__token", '', {
  //     sameSite: "strict",
  //     secure: process.env.NODE_ENV !== 'development',
  //     maxAge: -1,
  //     path: '/',
  //     httpOnly: true,
  //     expires: new Date(0)
  //   })
  // );
  res.setHeader(
    "Set-Cookie",
    [
      cookie.serialize("qual__token", '', {
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }),
      cookie.serialize("qual__isLoggedIn", '', {
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
        path: '/',
        httpOnly: true,
        expires: new Date(0)
      }),
      
    ]
    // cookie.serialize("ual__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
  );
  console.log("77777777777777777777777777777777777")
  console.log("77777777777777777777777777777777777")
  console.log("after cookie removal")
  console.log("77777777777777777777777777777777777")
  console.log("77777777777777777777777777777777777")
  // res.cookie('qual__isLoggedIn', '', { expires: new Date(1) });
  // res.cookie('qual__isLoggedIn', '', { expires: new Date(0), maxAge: -1 });
  res.status(200).send({ "success": "Logged out successfully!" });
});
export default handler;