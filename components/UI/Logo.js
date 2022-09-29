import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <div className="nav__logo-container">
      <div className="nav__logo">
        <h1>
          <Link passHref href="/" className="nav__logo-icon">
            <a>Qual<span>I</span>T</a>
          </Link>
        </h1>
      </div>
      <div className="nav__line"></div>
    </div>
  )
}
export default Logo;