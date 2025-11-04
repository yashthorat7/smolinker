import DeviceStats from '@/components/DeviceStats';
import Location from '@/components/Location';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { getClicksForUrl } from '@/utils/apiClicks';
import { deleteUrl, getUrl } from '@/utils/apiUrls';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const Link = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const { loading, data: url, fn, error } = useFetch(getUrl, { id, user_id: user?.id });

  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate('/dashboard');
  }

  let link = '';
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && <PulseLoader className="mb-4" size={10} color="black" />}
      <div className="flex flex-col justify-between gap-8 sm:flex-row">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="cursor-pointer text-6xl font-extrabold hover:underline">
            {url?.title}
          </span>
          <a
            href={`https://trimrr.in/${link}`}
            target="_blank"
            className="cursor-pointer text-3xl font-bold text-blue-400 hover:underline sm:text-4xl"
          >
            https://trimrr.in/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex w-full min-w-0 cursor-pointer items-center gap-1 hover:underline"
          >
            <LinkIcon className="shrink-0 p-1" />
            <span className="truncate">{url?.original_url}</span>
          </a>
          <span className="flex items-end text-sm font-extralight">
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(`https://trimrr.in/${link}`)}
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate('/dashboard');
                })
              }
              disable={loadingDelete}
            >
              {loadingDelete ? <PulseLoader size={5} color="black" /> : <Trash />}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center object-contain p-1 sm:self-start"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false ? 'No Statistics yet' : 'Loading Statistics..'}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
