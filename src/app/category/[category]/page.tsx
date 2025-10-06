"use client"
import React from 'react'
import useGetPostsByCategory from '@/hooks/useGetPostsByCategory';
import Link from 'next/link';
import Image from 'next/image';
import { Id } from '../../../../convex/_generated/dataModel';
interface PageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = params;

  // 👇 Fetch all posts of the selected category
  const { data: posts, loading } = useGetPostsByCategory(category);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading {category} news...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">
          No news found for <span className="font-semibold">{category}</span>.
        </p>
        <Link href="/" className="text-blue-600 underline mt-2">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} News
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            href={`/news/${post._id as Id<"posts">}`}
            key={post._id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            {post.postImage && (
              <Image
                src={post.postImage}
                alt={post.title}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
            )}

            <div className="p-4">
              <h2 className="font-semibold text-lg line-clamp-2">{post.title}</h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {post.content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}