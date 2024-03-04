import { useInfiniteQuery } from "@tanstack/react-query"
import { getPostsPaginated } from "./api/posts"

export function PostListInfinite() {
  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage, //* gives us the next page
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    //* when we try to fetch the next page getNextPageParam is called and we get the next page number and then queryFn is called in which pageParam is passed and getPostsPaginated is called
    getNextPageParam: prevData => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getPostsPaginated(pageParam),
  })

  if (status === "loading") return <h1>Loading...</h1>
  if (status === "error") return <h1>{JSON.stringify(error)}</h1>

  return (
    <>
      <h1>Post List Infinite</h1>
      {data.pages
        .flatMap(data => data.posts)
        .map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  )
}
