"use client"
import {useState} from 'react'

const Theme = () => {
    const themes = ["Dark", "light"];
    const [theme, setTheme] = useState(themes[0]);
  
    const handleTheme = (t) => {
      setTheme(t);
    };

  return {theme,themes,handleTheme};
}

export default Theme;