import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();
export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html suppressHydrationWarning>
        <Head />
        <body suppressHydrationWarning>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
