"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Article } from "@/types/types";
import Image from "next/image";
import { LoadingModal } from "../loadingModal";
import { RiSearch2Fill } from "react-icons/ri";
import { FaSadCry } from "react-icons/fa";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const fetchArticles = async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const res = await api.get("/articles", {
        params: { page: currentPage, pageSize, searchTerm: search },
      });
      setArticles(res.data.articles);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  if (isLoading) {
    return <LoadingModal />;
  }

  return (
    <div className="flex flex-col items-center px-4 sm:p-6 sm:px-40 sm:pb-14 rounded-md shadow-md">
      <h2 className="text-lg sm:text-4xl font-semibold mb-4 text-center font-vogue m-16">
        Articles
      </h2>

      <div className="w-full flex flex-row items-center mb-4">
        <input
          type="text"
          placeholder="Search articles by title or content"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="p-2 sm:p-4 w-full border-2 rounded-l-md shadow"
        />
        <button
          onClick={() => {
            setPage(1);
            setSearchQuery(searchTerm);
          }}
          className="-ml-2 h-full bg-blue-500 flex items-center justify-center p-2 rounded-r-full md:p-4 hover:bg-blue-600 cursor-pointer"
        >
          <RiSearch2Fill size={30} className="text-white w-full" />
        </button>
      </div>

      <ul className="flex flex-col gap-2 mb-4 w-full">
        {articles.length > 0 ? (
          articles.map((article) => (
            <li
              key={article.id}
              onClick={() => router.push(`/articles/${article.id}`)}
              className="flex flex-row p-2 sm:p-4 rounded-md hover:bg-gray-200 transition-all cursor-pointer shadow gap-4"
            >
              <Image
                src={article.pictureUrl || "/images/default_image.jpg"}
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
          ))
        ) : (
          <div className="h-32 flex items-center justify-center gap-4">
            <FaSadCry size={24} className="text-slate-600" />
            No articles found
          </div>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex gap-2 mb-10">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="p-2 sm:p-4 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded-md disabled:opacity-50 transition-all"
        >
          Previous
        </button>

        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage((prev) => prev + 1)}
          className="p-2 sm:p-4 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded-md disabled:opacity-50 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
