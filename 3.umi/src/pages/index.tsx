import { useEffect } from 'react';
import { Link } from 'umi';

import styles from './index.less';

export default function IndexPage() {
  const getUser = () => {
    fetch('/api/users').then(res => res.json()).then(data => console.log(data))
  }

  useEffect(() => {
    getUser()
  }, [])
  
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>

      <div className="content">
        <Link to="/test">test page</Link>
      </div>
    </div>
  );
}
