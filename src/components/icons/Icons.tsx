type Props <T extends unknown = unknown> = {
    width?: string|`${number}px`,
    height?: string|`${number}px`,
    fill?: string
} & T

export type BackIconProps = Props<{
    strokeWidth?: number,
    style?: React.CSSProperties
}>
export const BackIcon = ({
    width, height, style, fill, strokeWidth
}: BackIconProps)=>{
    return <>
    <svg width={width||50} height={height||50} viewBox="0 0 50 50"
    style={{
        transition: "all 0.3s ease",
        ...style
    }}>
    <path d="M34.475 8.525 15.525 25l18.95 16.475"
        style={{
            fill: "none",
            stroke: fill||"#fff",
            strokeWidth: strokeWidth||5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
        }}
    />
    </svg>
    </>  
}
export const ThemeIcon = ({
    width, height, mode, fill
}:Props<{mode:"light"|"default"|"dark"}>) => {
    const themeLight = <>
    <svg width={width||"24px"} height={height||"24px"} viewBox="0 -960 960 960" 
    fill= {fill||"rgba(255, 255, 255, 1)"}>
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 
    0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
    </svg>
    </>

    const themeDefault = <>
    <svg width={width||"24px"} height={height||"24px"} viewBox="0 0 24 24.000001"
        fill={fill||"white"}
    >
    <path d="M 10.41009,2.6337108 A 9.366666,9.366666 0 0 0 1.0438004,12 9.366666,9.366666 0 0 0 10.41009,21.36629 V 18.939932 A 6.9403613,6.9403613 0 0 1 3.470158,12 6.9403613,6.9403613 0 0 1 10.41009,5.0600684 Z" />
    <circle cx="10.410089" cy="12" r="3.8651605" />
    <rect width="6.9283314" height="2.5454481" x="16.027868" y="10.727276" ry="1.272724" />
    <rect width="6.9283314" height="2.5454481" x="4.5030785" y="14.567303" ry="1.272724" transform="rotate(-45)" />
    <rect width="6.9283314" height="2.5454478" x="21.449112" y="-2.3787344" ry="1.2727239" transform="matrix(0.70710678,0.70710678,0.70710678,-0.70710678,0,0)" />
    </svg>
    </>

    const themeDark = <>
    <svg width={width||"24px"} height={height||"24px"} viewBox="0 -960 960 960"
        fill={fill||"rgba(255, 255, 255, 1)"}
    >
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
    </svg>
    </>
    return mode==='dark'?themeDark: mode==='light'? themeLight: mode==='default'? themeDefault: null
}
export const LogoutIcon = ({width, height, fill, strokeWidth}:{
    width?: string| `${number}px`,
    height?: string| `${number}px`,
    fill?: string,
    strokeWidth?: number,
})=>{
    return <>
    <svg xmlns="http://www.w3.org/2000/svg" width={width||24} height={height||24}
    style={{
        stroke:fill||"#fff", strokeWidth:strokeWidth||2, fill:"none"
    }} viewBox="0 0 24 24">
        <path
        d="M17.01 17.788s-.04 2.826-3.016 2.818l-6.583-.016c-1.404-.003-2.788-.923-2.788-2.86V6.27c0-1.937 1.384-2.857 2.788-2.86l6.583-.016c2.975-.008 3.017 2.818 3.017 2.818"
        style={{
            // stroke: "#fff",
            // strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 1,
        }}
        />
        <path
        d="m16.709 9.56 2.792 2.761-2.792 2.762m-5.433-2.747h6.084"
        style={{
            // stroke: "#fff",
            // strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 1,
        }}
        transform="translate(2.513 -.321)"
        />
    </svg>
    </>
}
export const ProfileActionsIcon = ({width, height, fill,mode}:{
    width?: string| `${number}px`,
    height?: string| `${number}px`,
    fill?: string,
    mode: 'add'|'update'|'delete'
})=> (
    <svg width={width||25} height={height||25} viewBox="0 0 50 50" fill={fill||'white'}>
    <path display={mode==='add'?"inline":"none"}
    d="M25 3.006A21.995 21.995 0 0 0 3.006 25 21.995 21.995 0 0 0 25 46.994 21.995 21.995 0 0 0 46.994 25 21.995 21.995 0 0 0 25 3.006ZM25 11c2.216 0 4 1.784 4 4v6h6c2.216 0 4 1.784 4 4s-1.784 4-4 4h-6v6c0 2.216-1.784 4-4 4s-4-1.784-4-4v-6h-6c-2.216 0-4-1.784-4-4s1.784-4 4-4h6v-6c0-2.216 1.784-4 4-4z"
    />
    <path display={mode==='update'?"inline":"none"}
    d="M25 3.006A21.995 21.995 0 0 0 3.006 25 21.995 21.995 0 0 0 25 46.994 21.995 21.995 0 0 0 46.994 25 21.995 21.995 0 0 0 25 3.006Zm0 10.16a7.625 7.625 0 0 1 3.6.906l.421.244c.28.181.548.38.801.596-.234-.2-.48-.387-.736-.558l10.246 5.916a3.99 3.99 0 0 1 1.465 5.462 3.992 3.992 0 0 1-5.465 1.465l-3.947-2.279-5.635-3.254a1.449 1.449 0 0 1-.086-.027 1.937 1.937 0 0 0-.656-.104c-.251 0-.45.031-.668.108l-.117.04-.008.003-5.6 3.234-3.947 2.28a3.992 3.992 0 0 1-5.465-1.466 3.99 3.99 0 0 1 1.465-5.462l10.46-6.041.124-.07A7.625 7.625 0 0 1 25 13.165Zm0 15c.739 0 1.466.184 2.117.533l.248.145c.093.059.184.122.272.187a4.48 4.48 0 0 0-.233-.166l6.026 3.479a2.349 2.349 0 0 1 .861 3.215 2.346 2.346 0 0 1-3.213.86l-2.322-1.34-3.315-1.915a.735.735 0 0 1-.05-.016 1.144 1.144 0 0 0-.387-.06c-.148 0-.264.017-.393.062l-.068.026h-.004l-3.295 1.902-2.322 1.342a2.346 2.346 0 0 1-3.213-.861 2.349 2.349 0 0 1 .861-3.215l6.153-3.553.072-.041A4.485 4.485 0 0 1 25 28.166Zm2.637.865z"
    />
    <path display={mode==='delete'?"inline":"none"}
    d="m24.478 33.448-.022-10.409a.77.77 0 0 1 .77-.774.77.77 0 0 1 .774.77l.022 10.41a.77.77 0 0 1-.77.773.77.77 0 0 1-.774-.77zm-2.452-.07-.74-10.382a.77.77 0 0 0-.826-.715.77.77 0 0 0-.715.825l.74 10.382a.77.77 0 0 0 .826.715.77.77 0 0 0 .715-.825zm6.073 0 .74-10.382a.77.77 0 0 1 .825-.715.77.77 0 0 1 .715.825l-.74 10.382a.77.77 0 0 1-.825.715.77.77 0 0 1-.715-.825zM25 3.006A21.995 21.995 0 0 0 3.006 25 21.995 21.995 0 0 0 25 46.994 21.995 21.995 0 0 0 46.994 25 21.995 21.995 0 0 0 25 3.006Zm-.24 7.537a1.503 1.503 0 0 1 1.556.937l6.204-.671c.924-.1 1.747.562 1.847 1.486.1.924-.562 1.751-1.486 1.851L17.6 15.805c-.925.1-1.75-.564-1.85-1.489-.1-.924.564-1.749 1.488-1.85l6.203-.673a1.503 1.503 0 0 1 1.319-1.25zm-3.057 6.094h6.594c.105 0 .21.007.312.015v-.004h3.043c.872 0 1.825.69 1.721 1.975L32.061 34.9l-.01-.054a3.758 3.758 0 0 1-3.754 3.46h-6.594a3.757 3.757 0 0 1-3.756-3.517l-1.302-16.166c-.104-1.286.847-1.975 1.718-1.975h3.045v.002c.098-.007.196-.013.295-.013z"
    />
  </svg>
)

export const TickIcon = ({width, height, fill}:{
    width?: string| `${number}px`,
    height?: string| `${number}px`,
    fill?: string
})=>(
    <svg width={width||"25px"} height={height||'25px'} viewBox="0 -960 960 960"
    fill={fill||"#ffffff"}>
        <path d="m382-339.38 345.54-345.54q8.92-8.93 20.88-9.12 11.96-.19 21.27
        9.12 9.31 9.31 9.31 21.38 0 12.08-9.31 21.39l-362.38 363q-10.85 10.84-25.31
        10.84-14.46 0-25.31-10.84l-167-167q-8.92-8.93-8.8-21.2.11-12.26
        9.42-21.57t21.38-9.31q12.08 0 21.39 9.31L382-339.38Z"/>
    </svg>
)
export const SettingsIcon = ({width, height, fill}:{
    width?: string| `${number}px`,
    height?: string| `${number}px`,
    fill?: string
}) => (
    <svg height={height||'24px'} width={width||"24px"}
        viewBox="0 -960 960 960" fill={fill||"#ffffff"}
    >
    <path d={"M435.69-100q-20.46 0-35.34-13.58-14.89-13.57-18.12-33.42l-"+
    "9.77-74.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L240-228.23q-18.85 "+
    "8.31-37.88 1.61-19.04-6.69-29.58-24.3l-45.08-78.16q-10.54-17.61-6.07-37.27 "+
    "4.46-19.65 20.46-32.42l59.92-45q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27l-59.92-45q-16-12.77-20.27-32.62-4.27-19.84 6.27-37.46l44.69-77q10.54-17.23 29.58-24.11 19.03-6.89 37.88 1.42l68.92 29.08q14.47-11.46 30.89-20.96t32.27-15.27L382.23-813q3.23-19.85 18.12-33.42Q415.23-860 435.69-860h88.62q20.46 0 35.34 13.58 14.89 13.57 18.12 33.42l9.77 75.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58L720.39-731q18.84-8.31 37.88-1.42 19.04 6.88 29.57 24.11l44.7 77.39q10.54 17.61 6.07 37.27-4.46 19.65-20.46 32.42l-61.46 46.15q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27l60.3 45.38q16 12.77 20.66 32.42 4.65 19.66-5.89 37.27l-45.31 77.77q-10.53 17.62-29.76 24.31-19.23 6.69-38.08-1.62l-68.46-29.46q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L577.77-147q-3.23 19.85-18.12 33.42Q544.77-100 524.31-100h-88.62Zm4.31-60h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-"+"86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 "+
    "480.46-360ZM480-480Z"}/>
    </svg>
)

export const InfoIcon = ({width, height, fill, iconStyle, strokeWidth}:{
    width?: string| `${number}px`,
    height?: string| `${number}px`,
    fill?: string,
    iconStyle?: 2,
    strokeWidth?: number
}) => {
    return iconStyle === 2? <>
    <svg width={width||50} height={height||50} viewBox="0 0 50 50">
        <path
        d="M42.933 25A17.933 17.933 0 0 1 25 42.933 17.933 17.933 0 0 1 7.067 25 17.933 17.933 0 0 1 25 7.067 17.933 17.933 0 0 1 42.933 25Z"
        style={{
            fill: "none",
            stroke: fill||"#fff",
            strokeWidth: strokeWidth||4
        }}
        />
        <path
        d="M26.139 17.93A1.139 1.139 0 0 1 25 19.068a1.139 1.139 0 0 1-1.139-1.138A1.139 1.139 0 0 1 25 16.79a1.139 1.139 0 0 1 1.139 1.139z"
        style={{
            fill: fill||"#fff",
            stroke: fill||"#fff",
            strokeWidth: (strokeWidth||4)/2,
        }}
        transform="translate(0 -.521)"
        />
        <path
        d="M25 24.308v8.943"
        style={{
            fill: "none",
            stroke: fill||"#fff",
            strokeWidth: strokeWidth||4,
        }}
        transform="translate(0 -.521)"
        />
    </svg>
    </>:<>
    <svg viewBox="0 -960 960 960" fill={fill||"#ffffff"}
        width={width||"24px"} height={height||"24px"}
    >
    <path d={"M480.01-290q12.76 0 21.37-8.63Q510-307.25 510-320v-170q0-12.75-"+
    "8.63-21.38-8.63-8.62-21.38-8.62-12.76 0-21.37 8.62Q450-502.75 450-490v170q0"+
    " 12.75 8.63 21.37 8.63 8.63 21.38 8.63ZM480-588.46q13.73 0 23.02-9.29t9.29-23"+
    ".02q0-13.73-9.29-23.02-9.29-9.28-23.02-9.28t-23.02 9.28q-9.29 9.29-9.29 23.02t9.29 23.02q9.29 9.29 23.02 9.29Zm.07 488.46q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84"+
    " 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 "+
    "81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"}/>
    </svg>
    </>
    
}

export const UserIcon = ({width, height, hidden, fill, className, style}:{
    width?: string, height?: string,
    hidden?:boolean, fill?: string,
    className?: string,
    style?: React.CSSProperties
}) => (
    <svg width={width} height={height} viewBox="0 0 700 700" style={{
        display: hidden?"none":'block',
        ...style
    }} className={className}>
    <g style={{
        display: "inline",
        fill: fill||"#ffffffff",
        fillOpacity: 1,
    }} transform="matrix(1.37944 0 0 1.37944 -132.88 -138.959)">
        <path
        d="M144.877 485.9A246.916 246.916 0 0 0 350 596.916a246.916 246.916 0 0 0 205.639-111.754A245.967 264.01 0 0 0 350 365.99 245.967 264.01 0 0 0 144.877 485.9Z"
        style={{
            //fill: "#fff", strokeWidth: 0,
            strokeLinecap: "round", strokeLinejoin: "round",
            paintOrder: "markers fill stroke",
        }}/>
        <circle cx={350} cy={238} r={93.068}
        style={{
            //fill: "#fff",  stroke: "none",
            strokeWidth: 0, strokeLinecap: "round", strokeLinejoin: "round",
            strokeDasharray: "none", strokeOpacity: 1,
            paintOrder: "markers fill stroke",
        }} />
    </g>
</svg>)

export const HomeFloatingIcons = ({mode, fill, height, width, style}:{
    mode:"dashboard"|"library"|'courses',
    width?: string|`${number}px`,
    height?: string|`${number}px`,
    style?: React.CSSProperties,
    fill?: string,
}) => (
  <svg width={width||25} height={height||25} viewBox="0 0 50 50" style={style}>
    <path
        d="M12.443 10.805a4.364 4.364 0 0 0-4.373 4.373v2.138c11.287-.022 22.573-.011 33.86-.011v-2.127a4.364 4.364 0 0 0-4.373-4.373zm-3.417 6.628h32.286a4.363 4.363 0 0 1 4.373 4.373v16.437a4.363 4.363 0 0 1-4.373 4.373H9.026a4.363 4.363 0 0 1-4.373-4.373V21.806a4.363 4.363 0 0 1 4.373-4.373z"
        style={{
        display: mode==='library'?"inline":"none",
        fill: "none", transition: "all 0.2s ease",
        stroke: fill||"#fff",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "none",
        strokeOpacity: 1,
        paintOrder: "markers fill stroke",
      }}
    />
    <path
        d="M12.452 34.482a2.302 2.302 0 0 0-2.306 2.307v3.882a2.3 2.3 0 0 0 2.306 2.305h25.096a2.3 2.3 0 0 0 2.306-2.305V36.79a2.302 2.302 0 0 0-2.306-2.307zm7.343 2.588a1.696 1.696 0 0 1 1.695 1.697 1.696 1.696 0 0 1-1.695 1.695 1.696 1.696 0 0 1-1.697-1.695 1.696 1.696 0 0 1 1.697-1.697zm5.205 0a1.696 1.696 0 0 1 1.695 1.697A1.696 1.696 0 0 1 25 40.462a1.696 1.696 0 0 1-1.695-1.695A1.696 1.696 0 0 1 25 37.07Zm5.205 0a1.696 1.696 0 0 1 1.697 1.697 1.696 1.696 0 0 1-1.697 1.695 1.696 1.696 0 0 1-1.695-1.695 1.696 1.696 0 0 1 1.695-1.697zM8.518 21.434h32.964a3.021 3.021 0 0 1 3.028 3.027v5.102a3.021 3.021 0 0 1-3.028 3.028H8.518a3.021 3.021 0 0 1-3.028-3.028V24.46a3.021 3.021 0 0 1 3.028-3.027zM6.425 7.024h37.15a3.405 3.405 0 0 1 3.413 3.413v5.749a3.405 3.405 0 0 1-3.413 3.412H6.425a3.405 3.405 0 0 1-3.413-3.412v-5.75a3.405 3.405 0 0 1 3.413-3.412z"
        style={{
        display: mode==='courses'?"inline":"none",
        fill: fill||"#fff",
        strokeWidth: 3.35931, transition: "all 0.2s ease",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        paintOrder: "markers fill stroke",
      }}
    />
    <path
        d="M5.54 42.621h17.427M9.766 7.548h8.941a4.363 4.363 0 0 1 4.373 4.373v18.174a4.363 4.363 0 0 1-4.373 4.373H9.766a4.363 4.363 0 0 1-4.373-4.373V11.92a4.363 4.363 0 0 1 4.373-4.373zm19.97-.169h14.72m.151 27.714a7.52 7.52 0 1 1-15.038.01 7.52 7.52 0 0 1 15.038-.014m-14.87-18.69h14.72M9.765 7.551h8.941a4.363 4.363 0 0 1 4.373 4.373V30.1a4.363 4.363 0 0 1-4.373 4.373H9.766a4.363 4.363 0 0 1-4.373-4.373V11.925a4.363 4.363 0 0 1 4.373-4.373zm19.97-.169h14.72m.151 27.714a7.52 7.52 0 1 1-15.038.01 7.52 7.52 0 0 1 15.038-.014"
        style={{
        display: mode==='dashboard'?"inline":"none",
        fill: "none", transition: "all 0.2s ease",
        stroke: fill||"#fff",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "none",
        strokeOpacity: 1,
        paintOrder: "markers fill stroke",
        }}
    />
    </svg>
)

export const SettingsFloatingIcons = ({mode, fill, height, width}:{
    mode:"account"|"profile", fill?: string,
    height?: string | `${number}px`,
    width?: string | `${number}px`,
}) => (
    <svg width={width||25} height={height||25} viewBox="0 0 25 25" fill={fill||"white"}>
    <path
        d="M15.902 8.211a3.402 3.402 0 0 1-3.402 3.402A3.402 3.402 0 0 1 9.098 8.21 3.402 3.402 0 0 1 12.5 4.81a3.402 3.402 0 0 1 3.402 3.402Zm4.087 8.888c-1.023-1.459-3.472-4.178-7.556-4.178-4.067 0-6.441 2.696-7.432 4.159a8.8 8.8 0 0 0 .653.921h13.692a8.8 8.8 0 0 0 .643-.902zm-.643.902H5.654A8.8 8.8 0 0 0 12.5 21.3 8.8 8.8 0 0 0 19.346 18ZM12.5 1.365A11.135 11.135 0 0 0 1.365 12.5 11.135 11.135 0 0 0 12.5 23.635 11.135 11.135 0 0 0 23.635 12.5 11.135 11.135 0 0 0 12.5 1.365Zm0 1.519a9.616 9.616 0 0 1 9.616 9.616 9.616 9.616 0 0 1-9.616 9.616A9.616 9.616 0 0 1 2.884 12.5 9.616 9.616 0 0 1 12.5 2.884Z"
        style={{
            display: mode==='profile'?"inline":"none",
            fillOpacity: 1,
            strokeWidth: 4.28889,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            paintOrder: "markers fill stroke",
        }}
    />
    <path
        d="M12.5 1.25c-1.321 0-2.385 1.156-2.385 2.59v.648c.07.547.947 1.666.756 2.35-.095.34-.694.877-.756 1.414v.236c.07.547.947 1.666.756 2.35-.095.34-.694.877-.756 1.414v1.639l-.008.004v.003a5.314 5.314 0 0 0-2.921 4.725 5.314 5.314 0 0 0 5.314 5.314 5.314 5.314 0 0 0 5.314-5.314 5.314 5.314 0 0 0-2.93-4.746V3.839c0-1.433-1.063-2.589-2.384-2.589Zm-2.385 11.002V8.488c-.003-.022-.006-.044-.006-.064v3.916c0-.03.003-.059.006-.088zm0-4V4.488c-.003-.022-.006-.044-.006-.064V8.34c0-.03.003-.059.006-.088zM12.5 3.125a.28.28 0 0 1 .281.281v9.5a.28.28 0 1 1-.562 0v-9.5a.28.28 0 0 1 .281-.281Zm0 10.184a5.314 5.314 0 0 1 .025.002h-.048a5.314 5.314 0 0 1 .023-.002Zm-2.385 2.441.004.164c0-.028-.004-.056-.004-.084zm4.77.025v.055l-.002.037c0-.027 0-.062.002-.092zm-.807.475h.75c.528 0 .953.425.953.953v3.406a.951.951 0 0 1-.953.953h-.75a.951.951 0 0 1-.953-.953v-3.406c0-.528.425-.953.953-.953Z"
        style={{
            display: mode==='account'?'inline':"none",
            fillOpacity: 1,
            strokeWidth: 4.36036,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            paintOrder: "markers fill stroke",
        }}
    />
    </svg>
)