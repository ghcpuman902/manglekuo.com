'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState();
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/works/taiwan-ramen-2023/api/getUser')
      if (!res.ok) {
        throw new Error('Failed to fetch getUser API')
      }
      const userProfileRes = await res.json();
      if (userProfileRes) {
        console.log(`Getting user from user-context`, userProfileRes);
        setUserProfile(userProfileRes);
      } else {
        throw new Error(`User doesn't exist`)
      }
    }
    fetchData();
  }, []);


  return (
    <UserContext.Provider value={[userProfile, setUserProfile]}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const [userProfile, setUserProfile] = context;
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    if (userProfile !== undefined) {
      if (userProfile.email === undefined) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
  }, [userProfile]);

  const handleLogin = useCallback((userDetail) => {
    async function fetchData() {
      if (userDetail.email) {
        const res = await fetch('/works/taiwan-ramen-2023/api/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetail),
        })
        const userProfileRes = await res.json();
        if (!res.ok) {
          throw new Error('Failed to login', userProfileRes)
        } else {
          console.log(`login success`, userProfileRes);
          setUserProfile(userProfileRes);
        }
      }
    };
    fetchData();
  }, []);

  const handleLogout = useCallback(() => {
    async function fetchData() {
      const res = await fetch('/works/taiwan-ramen-2023/api/logout', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        throw new Error('Failed to logout', await res.json())
      }
      setUserProfile({});
      setIsLoggedIn(false);
    };
    fetchData();
  }, []);


  const handleUpdateShop = useCallback(({shopId, shopChange}) => {
    console.log(`handleUpdateShop`,{shopId, shopChange});
    async function fetchData() {
      const res = await fetch('/works/taiwan-ramen-2023/api/getUser', {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopId, shopChange }),
      })
      const resJson = await res.json();
      if (!res.ok) {
        throw new Error('Failed to patch', resJson)
      }
      console.log(`patch result:`,resJson);
    };
    fetchData();
  }, []);

  return { isLoggedIn, userProfile, handleLogin, handleLogout, handleUpdateShop };
}