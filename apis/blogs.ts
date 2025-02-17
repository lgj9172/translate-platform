import { Blog, BlogComment } from "@/types/entities";
import {
  ClientWithAuth,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./clients";

export const getBlogs = async ({ params }: { params: PaginationParams }) => {
  const response = await ClientWithAuth.get<PaginatedResponse<Blog>>(`/blogs`, {
    params,
  });
  return response.data.data;
};

export const getBlog = async ({ blogId }: { blogId: string }) => {
  const response = await ClientWithAuth.get<Response<Blog>>(`/blogs/${blogId}`);
  return response.data.data;
};

export const postBlog = async ({
  payload,
}: {
  payload: {
    title: string;
    content: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<Blog>>("/blogs", payload);
  return response.data.data;
};

export const putBlog = async ({
  blogId,
  payload,
}: {
  blogId: string;
  payload: {
    title: string;
    content: string;
  };
}) => {
  const response = await ClientWithAuth.put<Response<Blog>>(
    `/blogs/${blogId}`,
    payload,
  );
  return response.data.data;
};

export const deleteBlog = async ({ blogId }: { blogId: string }) => {
  const response = await ClientWithAuth.delete<Response<Blog>>(
    `/blogs/${blogId}`,
  );
  return response.data.data;
};

export const getBlogComments = async ({
  blogId,
  params,
}: {
  blogId: string;
  params: PaginationParams;
}) => {
  const response = await ClientWithAuth.get<PaginatedResponse<BlogComment>>(
    `/blogs/${blogId}/comments`,
    { params },
  );
  return response.data.data;
};

export const postBlogComment = async ({
  blogId,
  payload,
}: {
  blogId: string;
  payload: {
    content: string;
  };
}) => {
  const response = await ClientWithAuth.post<Response<BlogComment>>(
    `/blogs/${blogId}/comments`,
    payload,
  );
  return response.data.data;
};

export const putBlogComment = async ({
  blogId,
  commentId,
  payload,
}: {
  blogId: string;
  commentId: string;
  payload: {
    content: string;
  };
}) => {
  const response = await ClientWithAuth.put<Response<BlogComment>>(
    `/blogs/${blogId}/comments/${commentId}`,
    payload,
  );
  return response.data.data;
};

export const deleteBlogComment = async ({
  blogId,
  commentId,
}: {
  blogId: string;
  commentId: string;
}) => {
  const response = await ClientWithAuth.delete<Response<BlogComment>>(
    `/blogs/${blogId}/comments/${commentId}`,
  );
  return response.data.data;
};
