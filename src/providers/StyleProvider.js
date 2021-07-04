import React, {createContext, useEffect, useState, useContext} from 'react';
import {StatusBar} from 'react-native';
import Loading from '../components/Loading';
import {getUserTheme, setUserTheme} from '../utils/storage.util';
import darkTheme from '../styles/themes/darkTheme';
import lightTheme from '../styles/themes/lightTheme';
import generalColors from '../styles/themes/generalColors';
import rootStyles from '../styles/rootStyles';

export const ThemeContext = createContext();

export default function StyleProvider({children}) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const previousTheme = await getUserTheme();
        if (previousTheme) {
          setCurrentTheme(previousTheme);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <StatusBar
        backgroundColor={currentTheme === 'light' ? '#CCCCCC' : '#20232A'}
      />
      <ThemeContext.Provider value={{currentTheme, setCurrentTheme}}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export const useTheme = () => {
  const {currentTheme, setCurrentTheme} = useContext(ThemeContext);

  const isDark = currentTheme === 'dark';

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    await setUserTheme(newTheme);
  };

  const colors = Object.assign(generalColors, isDark ? darkTheme : lightTheme);

  return {currentTheme, toggleTheme, isDark, rootStyles, colors};
};
