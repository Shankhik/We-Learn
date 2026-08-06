type Props = {
    type: "OK"|"USER"|"EMAIL"|"DOC"
    width?: number|string,
    height?: number|string,
    fill?: string
}
const StageIcon = ({
    width, height, fill, type
}:Props) => {
    return <>
    <svg width={width||50} height={height||50} viewBox="0 0 50 50">
    <defs><path id="a" d="M27.242 17.005h11.675v23.096H27.242z" /></defs>
    <g style={{ display: type==="USER"? "inline" : "none" }}>
        <circle
            cx={24.594}
            cy={12.534}
            r={6.325}
            style={{
                fill: "none",
                stroke: fill||"#fff",
                strokeWidth: 1.5,//1.59032,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
            }}
        />
      <path
          d="M39.43 34.736c0 6.375-8.678 7.599-14.388 7.599-5.71 0-14.388-1.224-14.388-7.599s6.442-10.275 14.388-10.275c7.947 0 14.389 3.9 14.389 10.275z"
          style={{
                fill: "none",
                stroke: fill||"#fff",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
          }}
      />
    </g>
    <g style={{ display: type==="EMAIL"? "inline" : "none" }}>
        <path
            d="M41.186 25.57c.967-.655 1.9-1.387 2.765-2.21 1.724-1.641 1.96-3.556 1.96-3.556m-41.004 0s.237 1.914 1.96 3.555c6.654 6.333 17.305 7.414 17.305 7.414m-12.72-17.056h27.849a6.594 6.594 0 0 1 6.608 6.609v17.3a6.594 6.594 0 0 1-6.608 6.608H11.453a6.594 6.594 0 0 1-6.609-6.609v-17.3a6.594 6.594 0 0 1 6.609-6.608z"
            style={{
                display: "inline",
                fill: "none",
                stroke: fill||"#fff",
                strokeWidth: 1.70333,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
            }}
            transform="matrix(.88063 0 0 .88063 2.652 -.517)"
        />
        <path
            d="M33.375 25.363c-1.42 0-2.684.269-3.795.807a6.163 6.163 0 0 0-2.63 2.389c-.63 1.042-.944 2.295-.944 3.761 0 1.295.292 2.435.876 3.42a6.058 6.058 0 0 0 2.456 2.285c1.053.539 2.245.807 3.574.807.687 0 1.328-.057 1.924-.172a7.627 7.627 0 0 0 1.787-.549l-.412-1.17a7.92 7.92 0 0 1-1.58.465 9.865 9.865 0 0 1-1.72.137c-1.099 0-2.055-.205-2.868-.617a4.447 4.447 0 0 1-1.889-1.787c-.435-.79-.654-1.73-.654-2.819 0-1.18.241-2.197.722-3.056a4.885 4.885 0 0 1 2.01-1.994c.87-.459 1.878-.688 3.024-.688 1.27 0 2.301.225 3.091.672.79.447 1.358 1.047 1.702 1.803.343.744.515 1.586.515 2.525 0 .813-.127 1.473-.379 1.977s-.647.755-1.185.755c-.344 0-.596-.08-.756-.24-.16-.172-.24-.423-.24-.756v-4.312c-.802-.367-1.701-.55-2.698-.55a4 4 0 0 0-1.716.396 3.262 3.262 0 0 0-1.393 1.2c-.355.55-.531 1.232-.531 2.046 0 .618.102 1.192.308 1.718.218.516.544.934.979 1.254.435.31.98.463 1.633.463.389 0 .795-.063 1.218-.19.436-.125.86-.32 1.272-.583.195.263.442.458.74.584.31.114.686.172 1.133.172.664 0 1.231-.177 1.701-.532a3.28 3.28 0 0 0 1.047-1.443c.24-.607.361-1.26.361-1.959 0-1.18-.262-2.239-.789-3.178-.515-.939-1.277-1.678-2.285-2.217-1.008-.55-2.212-.824-3.61-.824zm.017 4.227a5.7 5.7 0 0 1 1.203.137v4.14c-.584.298-1.167.447-1.752.447-.584 0-1.008-.2-1.271-.601-.263-.401-.395-.952-.395-1.65 0-.539.09-.99.274-1.356.195-.378.459-.659.79-.842a2.405 2.405 0 0 1 1.151-.275z"
            style={{
                fontSize: 12,
                lineHeight: 0.95,
                fontFamily: "Gabriola",
                //InkscapeFontSpecification: "Gabriola",
                whiteSpace: "pre",
                //shapeInside: "url(#a)",
                display: "inline",
                fill: fill||"#fff",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round",
            }}
            transform="translate(-.381 -3.49)"
        />
    </g>
    <g style={{ display: type==="DOC"? "inline" : "none" }}>
        <rect
            width={29.78}
            height={35.025}
            x={10.11}
            y={7.487}
            ry={6.563}
            style={{
                fill: "none",
                fillOpacity: 1,
                stroke: fill||"#fff",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
        />
        <path
            d="M17.428 18.782h16.413M17.428 26.227h16.413M17.428 33.84h16.413"
            style={{
                fill: "none",
                fillOpacity: 1,
                stroke: fill||"#fff",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                strokeOpacity: 1,
            }}
            transform="translate(-.635 -1.311)"
        />
    </g>

    {/* OK */}
    <path
        d="M28.582 37.433h5.264a2.798 2.798 0 0 1 2.804 2.804 2.798 2.798 0 0 1-2.804 2.805h-5.264a2.798 2.798 0 0 1-2.804-2.805 2.798 2.798 0 0 1 2.804-2.804zm-.85-5.594H36.6a2.798 2.798 0 0 1 2.804 2.804 2.798 2.798 0 0 1-2.804 2.805H27.73a2.798 2.798 0 0 1-2.804-2.805 2.798 2.798 0 0 1 2.804-2.804zm-.548-5.596h10.184a2.798 2.798 0 0 1 2.805 2.804 2.798 2.798 0 0 1-2.805 2.804H27.184a2.798 2.798 0 0 1-2.805-2.804 2.798 2.798 0 0 1 2.805-2.804zm.547-5.653h7.756a2.798 2.798 0 0 1 2.804 2.805 2.798 2.798 0 0 1-2.804 2.804h-7.756a2.798 2.798 0 0 1-2.804-2.804 2.798 2.798 0 0 1 2.804-2.805zm1.499-.123s3.403-6.097 3.578-8.746c.124-1.881-.33-3.52-2.517-3.54-2.291-.022-3.42 3.14-4.903 5.496-2.462 3.91-2.575 3.788-3.34 4.294-4.617 3.05-6.562 3.289-8.942 5.427-2.413 2.168-3.133 5.305-2.917 10.468.12 2.9 1.503 5.93 3.713 7.33 4.215 2.669 13.766 1.75 13.766 1.75"
        style={{
            display: type === "OK"? "inline":"none",
            fill: "none",
            stroke: fill||"#fff",
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
        }}
    />
  </svg></>
};

export default StageIcon