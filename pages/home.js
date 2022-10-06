import Container from "@components/container";
import Layout from "@components/layout";
import PostList from "@components/postlist";
import { getClient, usePreviewSubscription } from "@lib/sanity";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "use-web3forms";
import { postquery, configQuery } from "@lib/groq";
import {
  LocationMarkerIcon,
  MailIcon,
  PhoneIcon
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import GetImage from "@utils/getImage";
export default function Contact(props) {
  const { postdata, siteconfig, preview } = props;

  const router = useRouter();
  //console.log(router.query.category);

  const { data: posts } = usePreviewSubscription(postquery, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined
  });

  const { data: siteConfig } = usePreviewSubscription(configQuery, {
    initialData: siteconfig,
    enabled: preview || router.query.preview !== undefined
  });
  //console.log(posts);
  const ogimage = siteConfig?.openGraphImage
    ? GetImage(siteConfig?.openGraphImage).src
    : defaultOG.src;

  return (
    <Layout {...siteconfig}>
      <Container>
        <h1 className="mt-1 mb-1 text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
          Home
        </h1>
        <div className="text-center">
          <p className="text-lg">Euteu bi</p>
        </div>

        <div className="grid my-10 md:grid-cols-2">
          <div className="my-10">
            <h2 className="text-2xl font-semibold dark:text-white">
              Posts
            </h2>
            <p className="max-w-sm mt-5">
              Les événements célébrés en{" "}
              {new Date().getFullYear() - 1} -{" "}
              {new Date().getFullYear()}
            </p>
            <p className="max-w-sm mt-5">
              Pour les événements prévus en{" "}
              {new Date().getFullYear() + 1}, <br />
              <span></span> veuillez contater votre serviteur
            </p>
            <div className="mt-5">
              <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
                <LocationMarkerIcon className="w-4 h-4" />
                <span>Bignona, Ziguinchor</span>
              </div>
              {siteconfig?.email && (
                <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
                  <MailIcon className="w-4 h-4" />
                  <a href={`mailto:${siteconfig.email}`}>
                    {siteconfig.email}
                  </a>
                </div>
              )}
              {siteconfig?.phone && (
                <div className="flex items-center mt-2 space-x-2 text-dark-600 dark:text-gray-400">
                  <PhoneIcon className="w-4 h-4" />
                  <a href={`tel:${siteconfig.phone}`}>
                    {siteconfig.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="grid gap-6 mt-10 grid-cols-1">
              {posts.slice(2, 4).map(post => (
                <PostList
                  key={post._id}
                  post={post}
                  aspect="square"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const post = await getClient(preview).fetch(postquery);
  const config = await getClient(preview).fetch(configQuery);

  return {
    props: {
      postdata: post,
      siteconfig: { ...config },
      preview
    },
    revalidate: 100
  };
}
