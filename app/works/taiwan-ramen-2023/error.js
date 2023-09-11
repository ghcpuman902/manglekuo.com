'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.log('logging error:', error);
  }, [error]);

  return (
      <div className="">
        <h2 className="">Error</h2>
        <p className="">{error?.message}</p>
      </div>
  );
}