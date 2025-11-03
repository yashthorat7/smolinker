import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-[25vh] mb-10 text-center text-4xl font-extrabold sm:mb-12 sm:text-6xl lg:text-7xl">
        No Need of Long URLs Now
      </h2>
      <form
        onSubmit={handleShorten}
        className="flex w-full flex-col gap-2 sm:h-14 sm:flex-row md:w-2/4 md:gap-0"
      >
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter your looooong URL"
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 px-4 py-3 md:rounded-r-none"
        />
        <Button type="submit" variant="destructive" className="h-full md:rounded-l-none">
          Shortify!
        </Button>
      </form>
      {/* <img src="banner.jpg" alt="banner" className="w-full my-11 md:px-11" /> */}
      <Accordion type="multiple" collapsible className="mt-50 w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does the Smolink URL shortener works?</AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of that URL. This
            shortened URL redirects to the original long URL when accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is Smolink free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, our basic URL shortening service is completely free. We also offer premium plans
            with advanced features like custom branding and detailed analytics.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I track the performance of my shortened links?</AccordionTrigger>
          <AccordionContent>
            Absolutely! When you're logged into your account, you can access a dashboard to see how
            many clicks your links get, where the clicks are coming from, and more.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do my Smolink links ever expire?</AccordionTrigger>
          <AccordionContent>
            Links created with a free account do not expire. Paid plans offer the ability to set
            custom expiration dates or passwords for your links.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Landing;
