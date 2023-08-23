import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <h2>403 | Authorization Denied</h2>
        <div className="text">
          <p>User credentials are insufficient, access denied.</p>
          <p>Please contact support if this is an error.</p>
          <div>
            <p>
              Go back <Link passHref href="/"><a>Home</a></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};
export default NotFound;