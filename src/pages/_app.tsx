import React, { Suspense } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../theme/Theme";
import createEmotionCache from "../createEmotionCache";
import { Provider } from "react-redux";
import Store from "../store/Store";
import RTL from "../layouts/full/shared/customizer/RTL";
import { useSelector } from "../store/Store";
import { AppState } from "../store/Store";

import BlankLayout from "../layouts/blank/BlankLayout";
import FullLayout from "../layouts/full/FullLayout";

import "../_mockApis";
import "../utils/i18n";

// CSS FILES
import "react-quill/dist/quill.snow.css";
// import "./forms/form-quill/Quill.css";
// import "./apps/calendar/Calendar.css";
import "../styles/Quill.css"
import "../components/landingpage/testimonial/testimonial.css";
import "../components/landingpage/demo-slider/demo-slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/custom.css";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import client from "@/apollo/client";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;

  return (
    <ApolloProvider client={client}  >

      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>Modernize NextJs Admin template</title>
        </Head>

        <ThemeProvider theme={theme}>
          <RTL direction={customizer.activeDir}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RTL>
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider >
  );
};

export default (props: MyAppProps) => (
  <Provider store={Store}>
    <MyApp {...props} />
  </Provider>
);
