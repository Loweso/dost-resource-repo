"use client";

import React, { useState, useEffect } from "react";
import { RiArticleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Article } from "@/types/types";
import Image from "next/image";
import { LoadingModal } from "./loadingModal";

export default function ArticlesPreview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/articles/latest");
        setArticles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-4 sm:p-6 sm:px-40 sm:pb-14 rounded-md shadow-md">
      {isLoading && <LoadingModal />}
      <h2 className="text-lg sm:text-4xl font-semibold mb-4 text-center font-vogue m-10">
        Latest Articles
      </h2>

      <ul className="flex flex-col gap-2 mb-4 w-full">
        {articles.map((article) => (
          <li
            key={article.id}
            onClick={() => router.push(`/articles/${article.id}`)}
            className="flex flex-row p-2 sm:p-4 rounded-md hover:bg-gray-200 transition-all cursor-pointer shadow gap-4"
          >
            <Image
              src={article.pictureUrl}
              alt="Preview"
              width={400}
              height={250}
              className="rounded-md w-1/4 h-20 sm:h-40 shadow object-cover"
            />
            <div className="flex flex-col w-full gap-4">
              <p className="font-vogue font-bold text-sm sm:text-xl">
                {article.title}
              </p>
              <p className="line-clamp-3 leading-4 md:leading-5 font-creato text-xs sm:text-base text-justify">
                {article.content}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => router.push("/articles")}
        className="flex items-center gap-2 p-2 sm:p-4 bg-blue-500 hover:bg-blue-600 text-gray-100
        rounded-md transition-all cursor-pointer mb-10"
      >
        <RiArticleFill size={20} />
        See all articles
      </button>
    </div>
  );
}
