import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Copy, Delete, Download, Trash } from 'lucide-react';
import { deleteUrl } from '@/utils/apiUrls';
import useFetch from '@/hooks/use-fetch';
import { PulseLoader } from 'react-spinners';

const LinkCard = ({ url, fetchUrls }) => {
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL;
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

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);
  console.log(url.qr);

  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-white p-4 md:flex-row">
      <img
        src={url?.qr}
        className="h-32 self-start object-contain ring ring-blue-800"
        alt="qr-code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-1 flex-col">
        <span className="cursor-pointer text-3xl font-extrabold hover:underline">{url?.title}</span>
        <span className="cursor-pointer text-2xl font-bold text-blue-800 hover:underline">
          {websiteUrl}/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex cursor-pointer items-center gap-1 hover:underline">
          {url?.original_url}
        </span>
        <span className="flex flex-1 items-end text-sm font-extralight">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(`${websiteUrl}/${url?.short_url}`)}
        >
          <Copy size={10} />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download size={10} />
        </Button>
        <Button variant="ghost" onClick={() => fnDelete().then(() => fetchUrls())}>
          {loadingDelete ? <PulseLoader size={10} /> : <Trash size={10} />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
