import './App.css'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"


// /posts  ["posts"]
// /posts/1 ["posts",post.id]
// /posta?authorId=1 ["posts",{authorId:1}]
// /posts/2/comments ["posts",post.id,"comments"]

const POSTS = [
  { id: 1, title: "POST 1" },
  { id: 2, title: "POST 2" },
]

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })

}

function App() {
  const queryClient = useQueryClient()
  const postsQuery = useQuery({
    queryKey: ["posts"], // this the key to identify the query
    // the errors which comes over here are handled by postsQuery.isError but fetch does not gives any error so it should be thrown manually, error is thown in axios.
    queryFn: async ({ queryKey }) => await wait(1000).then(() => {
      console.log(queryKey)
      return [...POSTS]
    }),
    // staleTime: 1000 * 60 * 50, // by this we can mention the time after which the api will be called.
    // refetchInterval: 1000 // by this the api will be called after every 1000 ms
  })

  // const newPostMutation = useMutation({
  //   mutationFn: (title) => wait(1000).then(() => POSTS.push({ id: crypto.randomUUID, title })),
  // here we are refetching the posts on successfull attempt to add or update data
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["posts"])
  //   }
  // })

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <>
      <div>
        {
          postsQuery.data.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))
        }
        {/* <button disabled={newPostMutation.isPending} onClick={() => newPostMutation.mutate("new post")}>addNew</button> */}
      </div>
    </>
  )
}

export default App
