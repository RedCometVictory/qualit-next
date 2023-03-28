import Link from "next/link";
import { Button } from '@mui/material';

const ButtonUI = ({
  className, href, variant, // href,
  color, underline = 'none',
  disabled, children, ...restProps
}) => {
  return href ? (
    <Link
      passHref
      href={`${href}`}
    //   // href={{
    //   //   pathname: `${href}`,
    //   //   // query: { slug: 'create' }
    //   // }}
    //   // to={href}
      style={{ textDecoration: 'none' }}
    >
      <Button
        className={className ? className : ' '}
        variant={variant ? variant : 'text'}
        color={color ? color : 'secondary'}
        // color={color ? color : 'primary'}
        disabled={disabled ? disabled : false}
        {...{...restProps, underline}}
      >
        {children}
      </Button>
    </Link>
  ) : (
    <Button
      className={className ? className : ' '}
      variant={variant ? variant : 'text'}
      color={color ? color : 'primary'}
      disabled={disabled ? disabled : false}
      {...{...restProps, underline}}
    >
      {children}
    </Button>
  )
};
export default ButtonUI;

// ORIGINAL
// import Link from "next/router";
// import { Button } from '@mui/material';

// const ButtonUI = ({
//   className, href, text, variant, // href,
//   color, label, underline = 'none',
//   disabled, children, ...restProps
// }) => {
//   return href ? (
//     <Link
//       passHref
//       href={`${href}`}
//       // href={{
//       //   pathname: `${href}`,
//       //   // query: { slug: 'create' }
//       // }}
//       // to={href}
//       style={{ textDecoration: 'none' }}
//     >
//       <Button
//         className={className ? className : ' '}
//         variant={variant ? variant : 'text'}
//         color={color ? color : 'primary'}
//         disabled={disabled ? disabled : false}
//         {...{...restProps, underline}}
//       >
//         {children || label || text}
//       </Button>
//     </Link>
//   ) : (
//     <Button
//       className={className ? className : ' '}
//       variant={variant ? variant : 'text'}
//       color={color ? color : 'primary'}
//       disabled={disabled ? disabled : false}
//       {...{...restProps, underline}}
//     >
//       {children || label || text}
//     </Button>
//   )
// };
// export default ButtonUI;