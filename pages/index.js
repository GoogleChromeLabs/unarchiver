// This is the Link API
import Link from 'next/link';

const Index = () => (
  <div>
    <p>Unarchiver</p>

    <Link href="/about">
      <a>About</a>
    </Link>
  </div>
);
  
export default Index;
