import useFetch from '@/hooks/use-fetch';
import { getLongUrl } from '@/utils/apiUrls';
import { storeClicks } from '@/utils/apiClicks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <PulseLoader size={10} color="black" />
      </>
    );
  }

  return null;
};

export default RedirectLink;
