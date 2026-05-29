import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout({ children }: Props) {
  return <>{children}</>;
}
