import { Link } from 'umi';

export default function Layout({ children }) {
  return (
    <div>
      <Link to="/">Home</Link>

      <div>
        {children}
      </div>
    </div>
  );
}
