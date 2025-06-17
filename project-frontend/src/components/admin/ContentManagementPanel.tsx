"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/api";
import { LoadingModal } from "../loadingModal";
import AdminSidebar from "./AdminSideBar";
import { Article } from "@/types/types";
import AddContentModal from "./ContentAddNewModal";
import Image from "next/image";
import { FaEdit, FaSadCry } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import EditContentModal from "./ContentEditModal";
import DeleteContentModal from "./ContentDeleteModal";
import Link from "next/link";

export default function ContentManagementPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    fetchArticles(1, pageSize, "");
  }, []);

  const fetchArticles = async (page = 1, pageSize = 10, searchTerm = "") => {
    setIsLoading(true);
    try {
      const res = await api.get("/articles", {
        params: { page, pageSize, searchTerm },
      });

      console.log(res.data);

      setFilteredArticles(res.data.articles);
      setCurrentPage(res.data.page);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchArticles(1, pageSize, searchTerm);
  };

  return (
    <div className="flex h-screen w-screen sm:w-auto">
      <AdminSidebar />
      <Toaster />
      <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        {isLoading && <LoadingModal />}
        <div className="w-full shadow-lg rounded-lg p-3 sm:p-6 border border-gray-200 mt-16 sm:mt-4">
          <h2 className="text-lg sm:text-2xl font-semibold font-vogue mb-2">
            Content Management Panel
          </h2>
          <AddContentModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              fetchArticles(1, pageSize, searchTerm);
            }}
          />
          {articleToEdit && (
            <EditContentModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
              }}
              article={articleToEdit}
            />
          )}

          <DeleteContentModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            articleId={articleToEdit?.id ?? 0}
            articleTitle={articleToEdit?.title ?? ""}
            onDeleted={() => fetchArticles(1, pageSize, searchTerm)}
          />

          <div className="flex flex-col sm:flex-row mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600 hover:from-green-400 hover:via-blue-600 leading-4
              hover:to-purple-400 hover:opacity-[0.9] text-white cursor-pointer rounded-lg mr-2 p-2 text-sm sm:text-base w-full sm:w-auto"
            >
              + ADD NEW
            </button>
            <div className="flex flex-row mt-2 w-full">
              <input
                type="text"
                placeholder="Search articles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded-l-md w-full"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-gray-100 rounded-r-md cursor-pointer text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </div>

          {/* Display articles */}
          {filteredArticles.length === 0 && !isLoading && (
            <div className="h-32 flex items-center justify-center gap-4">
              <FaSadCry size={24} className="text-slate-600" />
              No articles found
            </div>
          )}

          <ul>
            {filteredArticles.map((article) => (
              <li
                key={article.id}
                className="relative flex flex-col sm:flex-row p-2 sm:p-4 mb-2 gap-4 bg-gradient-to-r
                from-green-50 via-yellow-50 to-pink-50 opacity-[0.95] hover:from-green-100 hover:via-yellow-100 hover:to-pink-100 hover:opacity-[0.87] shadow-lg rounded-lg"
              >
                <Link
                  href={`/articles/${article.id}`}
                  className="absolute inset-0 bg-transparent cursor-pointer z-0"
                ></Link>
                <div className="flex flex-row gap-2">
                  <Image
                    src={article.pictureUrl}
                    alt="Preview"
                    width={400}
                    height={250}
                    className="rounded-md w-full sm:min-w-32 sm:max-w-32 max-h-24 min-h-24 shadow object-cover"
                  />
                  <div className="sm:hidden">
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setArticleToEdit(article);
                      }}
                      className="relative z-10"
                    >
                      <FaEdit
                        size={22}
                        className="hover:opacity-75 cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setArticleToEdit(article);
                      }}
                      className="relative z-10"
                    >
                      <RiDeleteBin2Fill
                        size={22}
                        className="hover:opacity-75 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <p className="font-vogue font-bold text-sm sm:text-base">
                    {article.title}
                  </p>
                  <p className="line-clamp-3 leading-4 md:leading-5 font-creato text-xs sm:text-sm text-justify">
                    {article.content}
                  </p>
                </div>
                <div className="flex flex-col hidden sm:block justify-self-end self-end">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setArticleToEdit(article);
                    }}
                    className="relative z-10"
                  >
                    <FaEdit
                      size={22}
                      className="hover:opacity-75 cursor-pointer"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setArticleToEdit(article);
                    }}
                    className="relative z-10"
                  >
                    <RiDeleteBin2Fill
                      size={22}
                      className="hover:opacity-75 cursor-pointer"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {filteredArticles.length > 0 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  fetchArticles(currentPage - 1, pageSize, searchTerm)
                }
                className="p-2 bg-gray-500 text-gray-100 rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  fetchArticles(currentPage + 1, pageSize, searchTerm)
                }
                className="p-2 bg-gray-500 text-gray-100 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
