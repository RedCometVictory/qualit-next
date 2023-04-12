// import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const ThemeColor = ({ children }) => {
  const { theme } = useSelector(state => state.theme);
  // useMemo(() => {
  //   if (theme === "light" || !theme) {
  //     currentTheme = lightTheme;
  //   } else {
  //     currentTheme = darkTheme;
  //   }
  // }, [mode]);
  // const muiTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  


  const muiTheme = createTheme({
    palette: {
      // theme,
      mode: theme,
      ...(theme === 'light'
        ? {
            // values for light
            // divider: "#fde68a", // ---
            // contrastThreshold: 3,
            // tonalOffset: 0.2,
            neutral: {
              100: "#F3F4F6",
              200: "#E5E7EB",
              300: "#D1D5DB",
              400: "#9CA3AF",
              500: "#6B7280",
              600: "#4B5563",
              700: "#374151",
              800: "#1F2937",
              900: "#111827",
            },
            action: {
              active: "#6B7280",
              focus: "rgba(55, 65, 81, 0.12)",
              hover: "rgba(55, 65, 81, 0.04)",
              selected: "rgba(55, 65, 81, 0.08)",
              disabledBackground: "rgba(55, 65, 81, 0.12)",
              disabled: "rgba(55, 65, 81, 0.26)",
            },
            background: {
              // default: "#fbbf24", // ---
              // paper: "#fbbf24", // ---
              // // default: "#F9FAFC",
              // // paper: "#FFFFFF",
            },
            primary: {
              light: "#e3f2fd",
              main: "#1976d2",
              dark: "#42a5f5",
              contrastText: "#434343"
              // light: will be calculated from palette.primary.main,
              // dark: will be calculated from palette.primary.main,
              // contrastText: will be calculated to contrast with palette.primary.main
            },
            secondary: {
              main: "#ff9800", // ---
              // main: "#ffffff",
              // dark: will be calculated from palette.secondary.main,
              contrastText: '#ffcc00', // ---
              // main: "#10B981",
              light: "#3FC79A",
              dark: "#0B815A",
              // contrastText: "#FFFFFF",
            },
            // success: {
            //   // main: "#14B8A6",
            //   // light: "#43C6B7",
            //   // dark: "#0E8074",
            //   // contrastText: "#FFFFFF",
            // },
            // info: {
            //   // main: "#2196F3",
            //   // light: "#64B6F7",
            //   // dark: "#0B79D0",
            //   // contrastText: "#FFFFFF",
            // },
            // warning: {
            //   // main: "#FFB020",
            //   // light: "#FFBF4C",
            //   // dark: "#B27B16",
            //   // contrastText: "#FFFFFF",
            // },
            // error: {
            //   // main: "#D14343",
            //   // light: "#DA6868",
            //   // dark: "#922E2E",
            //   // contrastText: "#FFFFFF",
            // },
            // text: {
            //   // primary: "#000", // ---
            //   // secondary: "#27272a", // ---
            //   // // primary: "#121828",
            //   // // secondary: "#65748B",
            //   // disabled: "rgba(55, 65, 81, 0.48)",
            // }
          }
        : {
          // contrastThreshold: 3,
          // tonalOffset: 0.2,
          neutral: {
            // 100: "#F9FAFC",
            // 200: "#E5E7EB",
            // 300: "#D1D5DB",
            // 400: "#9CA3AF",
            // 500: "#6B7280",
            // 600: "#4B5563",
            // 700: "#374151",
            // 800: "#1F2937",
            // 900: "#111827",
          },
          action: {
            active: "#FFFFFF",
            focus: "rgba(255, 255, 255, 0.12)",
            hover: "rgba(255, 255, 255, 0.04)",
            selected: "rgba(255, 255, 255, 0.08)",
            disabledBackground: "rgba(255, 255, 255, 0.12)",
            disabled: "rgba(255, 255, 255, 0.26)",
          },
          background: {
            // default: "#000e21", // ---
            // paper: "#000e21", // ---
            // // default: "#1F2937",
            // // paper: "#1F2937",
          },
          // divider: "#004282", // ---
          // // divider: "#0E8074",
          primary: {
            // orange
            // light: "#ffb74d",
            // main: "#ff98", // ---
            // dark: "#fb8c00",

            // -Amber
            light: "#ffd54f",
            main: "#ffc107", // ---
            // dark: "#ffb300", // 600
            dark: "#ffa000", // 700
            contrastText: "#c5c1c1",
          },
          secondary: {
            main: "#4caf50", // ---
            light: "#54c558",
            dark: "#449747",
            contrastText: "#c5c1c1",
          },
          // success: {
          //   // main: "#14B8A6",
          //   // light: "#43C6B7",
          //   // dark: "#0E8074",
          //   // contrastText: "#FFFFFF",
          // },
          // info: {
          //   // main: "#2196F3",
          //   // light: "#64B6F7",
          //   // dark: "#0B79D0",
          //   // contrastText: "#FFFFFF",
          // },
          // warning: {
          //   // main: "#FFB020",
          //   // light: "#FFBF4C",
          //   // dark: "#B27B16",
          //   // contrastText: "#FFFFFF",
          // },
          // error: {
          //   // main: "#D14343",
          //   // light: "#DA6868",
          //   // dark: "#922E2E",
          //   // contrastText: "#FFFFFF",
          // },
          // text: {
          //   // primary: "#fff", // ---
          //   // secondary: "#71717a", // ---
          //   // disabled: "rgba(255, 255, 255, 0.48)",
          // }
        })
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000,
        lg: 1200,
        xl: 1920,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            color: `${theme === 'light' ? '#434343' : '#c5c1c1'}`
            // color = primary.contrastText
          }
        }
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            subtitle1: 'h2',
            subtitle2: 'h3',
            body1: 'div',
            body2: 'span',
            body3: 'a',
            button: 'button',
            caption: 'caption',
            overline: 'overline'
          }
        }
      },
      MuiButton: {
        // variants: [
        //   {
        //     props: { variant: 'outlined', color: 'primary' },
        //     style: {
        //       textTransform: 'none',
        //       // border: `2px dashed ${blue[500]}`,
        //     },
        //   },
        // ],
        // variants: [
        //   {
        //     props: {
        //       variant: 'outlined',
        //       color: 'secondary'
        //     },
        //   }
        // ],
        // defaultProps: {
        //   disableElevation: true,
        // },
        styleOverrides: {
          root: {
            // color: '#c5c1c1'
            // color: '#434343'
            color: `${theme === 'light' ? '#fcf8f8' : '#434343'}`
            // color: `${theme === 'light' ? '#c5c1c1' : '#434343'}`// ---
            // color: `${theme === 'light' ? '#c5c1c1' : '#8d8c8c'}`
        //     textTransform: "none",
          },
        //   sizeSmall: {
        //     padding: "6px 16px",
        //   },
        //   sizeMedium: {
        //     padding: "8px 20px",
        //   },
        //   sizeLarge: {
        //     padding: "11px 24px",
        //   },
        //   textSizeSmall: {
        //     padding: "7px 12px",
        //   },
        //   textSizeMedium: {
        //     padding: "9px 16px",
        //   },
        //   textSizeLarge: {
        //     padding: "12px 16px",
        //   },
        },
      },
      MuiButtonBase: {
        // defaultProps: {
        //   disableRipple: true,
        // },
      },
      MuiCardContent: {
        // styleOverrides: {
        //   root: {
        //     padding: "32px 24px",
        //     "&:last-child": {
        //       paddingBottom: "32px",
        //     },
        //   },
        // },
      },
      MuiCardHeader: {
        // defaultProps: {
        //   titleTypographyProps: {
        //     variant: "h6",
        //   },
        //   subheaderTypographyProps: {
        //     variant: "body2",
        //   },
        // },
        // styleOverrides: {
        //   root: {
        //     padding: "32px 24px",
        //   },
        // },
      },
      MuiCssBaseline: {
        // styleOverrides: {
        //   "*": {
        //     boxSizing: "border-box",
        //     margin: 0,
        //     padding: 0,
        //   },
        //   html: {
        //     MozOsxFontSmoothing: "grayscale",
        //     WebkitFontSmoothing: "antialiased",
        //     display: "flex",
        //     flexDirection: "column",
        //     minHeight: "100%",
        //     width: "100%",
        //   },
        //   body: {
        //     display: "flex",
        //     flex: "1 1 auto",
        //     flexDirection: "column",
        //     minHeight: "100%",
        //     width: "100%",
        //   },
        //   "#__next": {
        //     display: "flex",
        //     flex: "1 1 auto",
        //     flexDirection: "column",
        //     height: "100%",
        //     width: "100%",
        //   },
        // },
      // styleOverrides: {
      //   '@global': {},
      // },
      // styleOverrides: `
      // *{
      //   box-sizing: border-box;
      // }
      // html,
      // body {
      //   height: 100vh;
      //   width: calc(100vw - (100vw - 100%));;
      // }
      // #__next {
      //   height: 100vh;
      //   width: 100%;
      // }
      // `,
      },
      MuiOutlinedInput: {
        // styleOverrides: {
        //   notchedOutline: {
        //     borderColor: "#E6E8F0",
        //   },
        // },
      },
      MuiTableHead: {
        // styleOverrides: {
        //   root: {
        //     backgroundColor: "#F3F4F6",
        //     ".MuiTableCell-root": {
        //       color: "#374151",
        //     },
        //     borderBottom: "none",
        //     "& .MuiTableCell-root": {
        //       borderBottom: "none",
        //       fontSize: "12px",
        //       fontWeight: 600,
        //       lineHeight: 1,
        //       letterSpacing: 0.5,
        //       textTransform: "uppercase",
        //     },
        //     "& .MuiTableCell-paddingCheckbox": {
        //       paddingTop: 4,
        //       paddingBottom: 4,
        //     },
        //   },
        // },
      },
    },
    typography: {
      button: {
        fontWeight: 600,
        // textTransform: 'none'
      },
      fontFamily: '"PT Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      body1: {
        // fontSize: "1rem",
        // fontWeight: 400,
        // lineHeight: 1.5,
      },
      body2: {
        // fontSize: "0.875rem",
        // fontWeight: 400,
        // lineHeight: 1.57,
      },
      subtitle1: {
        // fontSize: "1rem",
        // fontWeight: 500,
        // lineHeight: 1.75,
      },
      subtitle2: {
        // fontSize: "0.875rem",
        // fontWeight: 500,
        // lineHeight: 1.57,
      },
      overline: {
        // fontSize: "0.75rem",
        // fontWeight: 600,
        // letterSpacing: "0.5px",
        // lineHeight: 2.5,
        // textTransform: "uppercase",
      },
      caption: {
        // fontSize: "0.75rem",
        // fontWeight: 400,
        // lineHeight: 1.66,
      },
      h1: {
        fontWeight: 800,
        // fontSize: '4rem'
        // fontSize: "3.5rem",
        fontSize: "2em",
        // lineHeight: 1.375,
      },
      h2: {
        fontWeight: 600,
        // fontSize: '3rem',
        fontSize: "1.5em",
        // lineHeight: 1.375,
      },
      h3: {
        // fontWeight: 700,
        // fontSize: '2rem'
        // fontSize: "2.25rem",
        fontSize: "1.17em",
        // lineHeight: 1.375,
      },
      h4: {
        // fontWeight: 700,
        // fontSize: '1.5rem'
        // fontSize: "2rem",
        fontSize: "1.02em",
        // lineHeight: 1.375,
      },
      h5: {
        // fontWeight: 600,
        // fontSize: '1.3rem'
        // fontSize: "1.5rem",
        fontSize: "0.83em",
        // lineHeight: 1.375,
      },
      h6: {
        // fontWeight: 600,
        // fontSize: '1rem'
        fontSize: "0.75em",
        // lineHeight: 1.375,
      },
      shape: {
        borderRadius: 8,
      },
      // shadows: [
      //   "none",
      //   "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
      //   "0px 1px 2px rgba(100, 116, 139, 0.12)",
      //   "0px 1px 4px rgba(100, 116, 139, 0.12)",
      //   "0px 1px 5px rgba(100, 116, 139, 0.12)",
      //   "0px 1px 6px rgba(100, 116, 139, 0.12)",
      //   "0px 2px 6px rgba(100, 116, 139, 0.12)",
      //   "0px 3px 6px rgba(100, 116, 139, 0.12)",
      //   "0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)",
      //   "0px 5px 12px rgba(100, 116, 139, 0.12)",
      //   "0px 5px 14px rgba(100, 116, 139, 0.12)",
      //   "0px 5px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 6px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 7px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 8px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 9px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 10px 15px rgba(100, 116, 139, 0.12)",
      //   "0px 12px 22px -8px rgba(100, 116, 139, 0.25)",
      //   "0px 13px 22px -8px rgba(100, 116, 139, 0.25)",
      //   "0px 14px 24px -8px rgba(100, 116, 139, 0.25)",
      //   "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
      //   "0px 25px 50px rgba(100, 116, 139, 0.25)",
      //   "0px 25px 50px rgba(100, 116, 139, 0.25)",
      //   "0px 25px 50px rgba(100, 116, 139, 0.25)",
      //   "0px 25px 50px rgba(100, 116, 139, 0.25)",
      // ]
    }
  })
  return (
    <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
  )
}
export default ThemeColor;