// TODO: create context here 
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { supabase } from '../supabaseClient';

// type UserContextType = {
//   user: any;
//   loading: boolean;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (data) {
//         setUser(data.user);
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     };

//     checkUser();

//     const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => {
//       listener?.unsubscribe();
//     };
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
