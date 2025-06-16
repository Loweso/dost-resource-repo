import React, { useState, useEffect } from "react";
import { UserStore } from "@/store/user";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";

interface CommentModalProps {
  submissionId: number | string;
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: number | string;
  content: string;
  user?: {
    userId?: number | string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

export function RequirementTrackerCommentModal({
  submissionId,
  isOpen,
  onClose,
}: CommentModalProps) {
  const { userId } = UserStore();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const [editId, setEditId] = useState<number | string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function fetchComments() {
    try {
      const res = await api.get(`/SubmissionComment/${submissionId}`);
      console.log(res.data);
      setComments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch comments.");
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) {
      toast.error("Non-empty comments not allowed!");
      return;
    }
    try {
      await api.post("/SubmissionComment", {
        submissionId,
        userId,
        content: newComment,
      });
      setNewComment("");
      toast.success("Comment added successfully!");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment.");
    }
  }

  async function handleEditComment(id: number | string) {
    if (!editContent.trim()) {
      toast.error("Non-empty comments not allowed!");
      return;
    }
    try {
      await api.put(`/SubmissionComment/${id}`, { content: editContent });
      setEditId(null);
      setEditContent("");
      toast.success("Comment updated successfully!");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment.");
    }
  }

  async function handleDeleteComment(id: number | string) {
    try {
      await api.delete(`/SubmissionComment/${id}`);
      toast.success("Comment removed successfully!");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment.");
    }
  }

  return isOpen ? (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center">
      <div className="bg-gray-100 p-3 sm:p-6 rounded-md w-11/12 sm:w-2/3">
        <h2 className="text-3xl font-vogue">Comments</h2>
        <div className="max-h-[60vh] md:max-h-[40vh] overflow-auto">
          {comments.length > 0 ? (
            <ul>
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center mb-4 bg-blue-100 shadow-lg p-2 sm:p-4 rounded-lg"
                >
                  <Image
                    src={
                      c?.user?.profileImageUrl || "/images/default_avatar.png"
                    }
                    width={100}
                    height={100}
                    alt="profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 mr-2 rounded-full self-start"
                  />
                  <div className="flex-1 leading-4">
                    <div className="text-black text-base sm:text-lg font-creato">
                      {c?.user?.firstName} {c?.user?.middleName}{" "}
                      {c?.user?.lastName}
                    </div>

                    {editId === c.id ? (
                      <input
                        className="border p-2 mr-2 w-full mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit your comment"
                      />
                    ) : (
                      <div className="text-xs sm:text-base">{c.content}</div>
                    )}

                    {c?.user?.userId == userId && (
                      <div className="flex mt-2">
                        {editId === c.id ? (
                          <>
                            <button
                              onClick={() => handleEditComment(c.id)}
                              className="p-1 sm:p-2 mr-2 bg-green-500 hover:bg-green-600 text-gray-100 rounded cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditId(null);
                                setEditContent("");
                              }}
                              className="p-1 sm:p-2 mr-2 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditId(c.id);
                                setEditContent(c.content);
                              }}
                              className="flex flex-row items-center p-1 sm:p-2 mr-2 sm:bg-yellow-500 cursor-pointer
                              sm:hover:bg-yellow-600 text-gray-100 gap-2 rounded text-yellow-500 sm:text-slate-900"
                            >
                              <FaEdit className="text-xl sm:text-base" />
                              <span className="hidden sm:block">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="flex flex-row items-center p-1 sm:p-2 mr-2 sm:bg-red-500 cursor-pointer
                              sm:hover:bg-red-600 text-gray-100 gap-2 rounded text-red-500 sm:text-white"
                            >
                              <MdDelete className="text-xl sm:text-base" />
                              <span className="hidden sm:block">Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-44 w-full flex items-center justify-center font-creato">
              No comments
            </div>
          )}
        </div>

        <input
          className="border p-2 mr-2 w-full mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button
          onClick={handleAddComment}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-gray-100 rounded mr-2 cursor-pointer"
        >
          + Comment
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-gray-500 hover:bg-slate-600 text-gray-100 rounded cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
}
