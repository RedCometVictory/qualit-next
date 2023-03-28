import React from 'react';
import Link from 'next/link';
import { Typography } from '@mui/material';

const Logo = () => {
  return (
    <div className="nav__logo-container">
      <div className="nav__logo">
        <Typography
          variant='h1'
          color={'primary.contrastText'}
        >
          <Link passHref href="/" className="nav__logo-icon">
            <a>Qual<span>I</span>T</a>
          </Link>
        </Typography>
      </div>
      <div className="nav__line"></div>
    </div>
  )
}
export default Logo;