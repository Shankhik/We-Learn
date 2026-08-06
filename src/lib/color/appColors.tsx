export const appColors = {
    red:{
        light: ["#e95858ff","#d34a4aff"],
        dark: ["#db6e6eff","#e75e5eff"]
    },
    green: {
        light: ["#44a361ff","#30ac55ff"],
        dark: ["#65b97eff","#48bd6bff"]
    },
    violet:{
        light: ["#4d53a8ff","#444cb9ff"],
        dark: ["#5b60afff","#5a61ceff"]
    },
    teal: {
        light: ["#1f8d75ff","#0b9476ff"],
        dark: ["#44a791ff","#33b498ff"]
    },
}

export const colorScheme = {
    accent: {
        blue: {
            light: "rgb(73, 103, 238)",
            dark: "rgb(80, 101, 221)"
        },
        red: {
            light: "rgb(206, 77, 77)",
            dark: "rgb(206, 77, 77)"
        },
        violet: {},
        green: {
            light: "rgb(49, 160, 108)",
            dark: "rgb(48, 150, 107)"
        },
    },
    page:{
        main: {
            light: "rgb(219, 216, 236)",
            dark: "rgb(13, 12, 19)"
        }
    },
    card: {
        light: "rgba(241, 241, 255, 0.5)",
        dark: "rgba(27, 27, 45, 0.5)"
    },
    form: {
        grey: {
            light: "rgb(158, 159, 187)",
            dark: "rgb(111, 113, 138)"
        }
    },
    button: {
        bg: {
            light: 'rgba(240, 241, 255, 0.7)',
            dark: 'rgba(38, 39, 53, 1)'
        },
        color: {
            light: 'rgba(74, 77, 102, 0.79)',
            dark: 'rgba(230, 232, 255, 0.79)'
        }
    },
    others: {
        greyBlue: {
            light: "rgb(137, 140, 190)",
            dark: "rgb(90, 96, 133)"
        },
    },
    getAlpha: (color: string, alpha: number)=> {
        const match = color.match(
            /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i
        );

        if (!match) {
            throw new Error("Invalid rgb/rgba color format");
        }

        return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    }
}