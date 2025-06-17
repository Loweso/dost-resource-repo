"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { LoadingModal } from "@/components/loadingModal";
import { Article } from "@/types/types";
import Image from "next/image";

export default function ArticlePage() {
  const { articleId } = useParams() as { articleId: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;

    (async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/articles/${articleId}`);
        setArticle(res.data);
        setDate(res.data.createdAt);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [articleId]);

  if (isLoading) {
    return <LoadingModal />;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="flex flex-col items-center md:mt-10 mb-24">
      {article.pictureUrl && (
        <Image
          src={"/images/dost-cover.png"}
          alt="Picture"
          width={2900}
          height={950}
          className="mb-4 shadow w-full h-[20vh] sm:h-[35vh] md:h-[60vh] object-cover"
        />
      )}
      <h1 className="text-2xl sm:text-5xl font-semibold mt-6 font-vogue">
        {article.title}
      </h1>
      <p className="mb-8">
        {date
          ? new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </p>

      <p className="font-creato text-justify leading-6 my-9">
        {article.content}
      </p>
    </div>
  );
}
