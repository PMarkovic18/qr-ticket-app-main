"use client"; 
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
const  ComponentWithAuth =(props) => {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (!user) {
        router.push('/api/auth/login');
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;

  };
  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
