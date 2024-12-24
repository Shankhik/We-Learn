//images
import FullLogo from './WeLearnLogo.svg'
import LogoIcon from './WeLearnLogo-icon.svg'
import UnAuthorized from './Unauthorized.svg'

const logo = {
    fullLogo: FullLogo,
    logoIcon : LogoIcon,
    unauthorized: UnAuthorized,
    loading: (width?:number)=>{
        return(
            <svg id='loading-animation' xmlns="http://www.w3.org/2000/svg" width={width? width:'200'} height='100%' viewBox=' 0 0 200 300'>
            <defs>
            <filter
                id="a"
                width={1.108}
                height={1.078}
                x={-0.054}
                y={-0.039}
                colorInterpolationFilters='sRGB'
            >
                <feGaussianBlur stdDeviation={4.049} />
            </filter>
            <path id="b" d="M35.591 96.699h135.072v39.707H35.591z" />
            </defs>
            <g
            style={{
                fill: "#fff",
                fillOpacity: 1,
            }}
            >
            <rect
                width={180}
                height={250}
                x={10}
                y={26.591}
                rx={20}
                style={{
                    fill: "#000",
                    fillOpacity: 1,
                    strokeWidth: 1.002,
                    filter: "url(#a)"
                }}
            />
            <rect
                width={180}
                height={250}
                x={10}
                y={26.591}
                rx={20}
                style={{
                fill: "#fff",
                fillOpacity: 1,
                strokeWidth: 1.002,
                }}
            />
            </g>
            <g
            style={{
                display: "inline",
            }}
            >
            <text
                xmlSpace="preserve"
                x={40.162}
                
                style={{
                fontSize: 24,
                lineHeight: "39.6px",
                fontFamily: "Rockwell",
                textAlign: "center",
                letterSpacing: 0,
                wordSpacing: 0,
                baselineShift: "baseline",
                whiteSpace: "pre",
                /*shapeInside: "url(#b)",*/
                display: "inline",
                fill: "#000",
                fillOpacity: 1,
                fillRule: "nonzero",
                strokeWidth: 1.002,
                }}
                transform="translate(-2.728 132.93)"
            >
                <tspan x={48.839} y={122.662}>
                <tspan
                    style={{
                    baselineShift: "baseline",
                    }}
                >
                    {"LOADING"}
                </tspan>
                </tspan>
            </text>
            </g>
            <g
            id='progress-bar'
            /*transform= 'rotate(300 100 130)'*/
            style={{
                display: "inline",
                transformOrigin: "100px 130px"
            }}
            >
            <path
                d="M100 40a60 60 0 0 0-60 60 60 60 0 0 0 60 60 60 60 0 0 0 60-60 60 60 0 0 0-60-60zm0 20a40 40 0 0 1 40 40 40 40 0 0 1-40 40 40 40 0 0 1-40-40 40 40 0 0 1 40-40z"
                style={{
                fill: "#c9c9c9",
                fillOpacity: 1,
                strokeWidth: 1.002,
                }}
                transform="translate(0 30)"
                
            />
            <path
                id='bar'
                d="M140 100a40 40 0 0 1-40 40 40 40 0 0 1-19.955-5.438L70 151.962a60 60 0 0 0 60 0A60 60 0 0 0 160 100Z"
                style={{
                    /*fill: "#42ff00",*/
                    fillOpacity: 1,
                    strokeWidth: 1.002,
                }}
                transform="translate(0 30)"
                
            />
            </g>
            </svg>
        )
    }
}
export default logo;