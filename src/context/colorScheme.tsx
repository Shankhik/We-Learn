'use client'

import { getCookie, setCookie } from "@/lib/cookies"
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"

export const colorScheme = {
    navbar: {
        red:{
            background:{
                light: 'rgb(165, 71, 71)',
                dark: 'rgb(124, 62, 62)'
            }
        },
        green:{
            background:{
                light: '#37913f',
                dark: '#64a85e'
            }
        },
        blue:{
            background:{
                light: '#4a6bb4',
                dark: '#3e73a5'
            }
        }
    },
    page: {
        red:{
            backgroundColor:{
                light: 'rgb(255, 233, 233)',
                dark: '#3d2d2d'
            }
        },
        green:{
            backgroundColor:{
                light: '#EFFFEB',
                dark: '#2F3D2D'
            }
        },
        blue:{
            backgroundColor:{
                light: '#ebf4ff',
                dark: '#2d3a49'
            }
        }
    },
    sidebar: {
        red:{
            backgroundColor:{
                light: 'rgba(255, 233, 233, 0.7)',
                dark: 'rgba(61, 45, 45, 0.7)'
            },
            active:{
                light: '#cc7070',
                dark: '#cc7070'
            },
            activeHover:{
                light: '#cc7e7e',
                dark: '#cc7e7e'
            },
            hover:{
                light: '#dea6a6',
                dark: '#ffdada54'
            }
        },
        green:{
            backgroundColor:{
                light: '#efffeba1',
                dark: 'rgba(47, 61, 45, 0.7)'
            },
            active:{
                light: '#5bb96b',
                dark: '#5bb96b'
            },
            activeHover:{
                light: '#77b982',
                dark: '#77b982'
            },
            hover:{
                light: '#a6deab',
                dark: 'rgba(234, 255, 231, 0.5)'
            }
        },
        blue:{
            backgroundColor:{
                light: 'rgba(235, 244, 255, 0.7)',
                dark: '#2d3a49b3'
            },
            active:{
                light: '#678bc0',
                dark: '#678bc0'
            },
            activeHover:{
                light: '#779ed8',
                dark: '#779ed8'
            },
            hover:{
                light: '#a0bce7',
                dark: '#647a9b'
            }
        }
    },
    sidebarIcon: {
        red:{
            inactive:{
                light: '',
                dark: ''
            },
            active:{
                light: '',
                dark: ''
            }
        },
        green:{
            inactive:{
                light: '',
                dark: ''
            },
            active:{
                light: '',
                dark: ''
            }
        },
        blue:{
            inactive:{
                light: '',
                dark: ''
            },
            active:{
                light: '',
                dark: ''
            }
        }
    }
}

export type AccentColors = 'red'|'green'|'blue'

type colorContextType = {
    effectiveTheme: 'light'|'dark';
    theme: 'light'|'default'|'dark';
    accentColor: 'red'|'green'|'blue';
    setEffectiveTheme: Dispatch<SetStateAction<"light" | "dark">>;
    setTheme: Dispatch<SetStateAction<"light" | "dark" | "default">>;
    setAccentColor: Dispatch<SetStateAction<AccentColors>>;
}

const colorContext = createContext<colorContextType>({
    effectiveTheme: 'dark',
    theme: 'dark',
    accentColor: 'blue',
    setEffectiveTheme: function (value: SetStateAction<"light" | "dark">): void {},
    setTheme: function (value: SetStateAction<"light" | "dark" | "default">): void {},
    setAccentColor: function (value: SetStateAction<AccentColors>): void {}
});

export const ColorContextProvider= ({children}:{children:ReactNode})=>{

    const [effectiveTheme, setEffectiveTheme] = useState<'light'|'dark'>('light');
    const [theme, setTheme] = useState<'dark'|'light'|'default'>('light');
    const [accentColor, setAccentColor] = useState<AccentColors>('blue');

    //Checks Theme cookie on 1st render
    useEffect(()=>{
        let cookie = getCookie('ColorScheme').cookie
        let cookie_theme, cookie_accentColor

        if(cookie){
            cookie_theme = cookie.split('; ')[0].split(': ')[1] as 'light'|'dark'|'default'
            cookie_accentColor = cookie.split('; ')[1].split(': ')[1] as AccentColors
        }
        if(cookie_theme && cookie_accentColor){
            setTheme(cookie_theme)
            setAccentColor(cookie_accentColor)
        }else setCookie('ColorScheme',`Theme: ${theme}; AccentColor: ${accentColor}`)

    })
    //Checks for Theme changes
    useEffect(()=>{
        let cookie = getCookie('ColorScheme').cookie
        let cookie_theme, cookie_accentColor
        if(cookie){
            cookie_theme = cookie.split('; ')[0].split(': ')[1] as 'light'|'dark'|'default'
            cookie_accentColor = cookie.split('; ')[1].split(': ')[1] as AccentColors
        }
        if (cookie_theme!== theme || cookie_accentColor!== accentColor)
            setCookie('ColorScheme', `Theme: ${theme}; AccentColor: ${accentColor}`)
    },[theme,accentColor])

    useEffect(()=>{
        const browserThemeChecker = (event:any)=>{
            if (theme === 'default') {
                if (event.matches){
                    setEffectiveTheme('dark')
                }
                else{
                    setEffectiveTheme('light')
                }
            }
            else {
                setEffectiveTheme(theme=== 'light'? 'light':'dark')
            }
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        //initial Run
        browserThemeChecker(window.matchMedia('(prefers-color-scheme: dark)'))
        
        mediaQuery.addEventListener('change',browserThemeChecker)
        return ()=> {
            mediaQuery.removeEventListener('change',browserThemeChecker)
        }

    },[theme])

    
    const value:colorContextType = {
        effectiveTheme: effectiveTheme,
        theme: theme,
        accentColor: accentColor,
        setEffectiveTheme: setEffectiveTheme,
        setTheme: setTheme,
        setAccentColor: setAccentColor
    }
    return <colorContext.Provider value={value}>{children}</colorContext.Provider>
}

export const useColorContext = ()=>{
    const {effectiveTheme, setEffectiveTheme, theme, setTheme, accentColor, setAccentColor} = useContext(colorContext);
    return { effectiveTheme, theme, setTheme, accentColor, setAccentColor }
}