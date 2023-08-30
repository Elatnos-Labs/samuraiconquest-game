import { Map } from '@/components/map.component';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { DefaultLayout } from '@/layouts/default.layout';
import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  const auth = useAuth();
  const { update: updateLayout } = useLayout();

  useEffect(() => {
    updateLayout({
      messages: false,
      notifications: false,
      profile: false,
      wallet: true,
      search: false,
    });
  }, []);

  if (!auth.user.user.isLogged) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Samurai Conquest</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map></Map>
    </>
  );
}

Home.getLayout = (page: JSX.Element) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

Home.getInitialProps = async ({ store, res }) => {
  if (res) {
    // res available only at server
    // no-store disable bfCache for any browser. So your HTML will not be cached
    res.setHeader('Cache-Control', 'no-store');
  }

  return {};
};
