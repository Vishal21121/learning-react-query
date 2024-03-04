import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { createPost } from "./api/posts"
import Post from "./Post"

export function CreatePost({ setCurrentPage }) {
  const titleRef = useRef()
  const bodyRef = useRef()
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: createPost,

    //* data is the data we get in response
    //* variables is the variables which are passed while calling createPostMutation.mutate method
    onSuccess: (data, variables, context) => {
      console.log(context)//* here we will get the value which is returned by onMutate

      queryClient.setQueryData(["posts", data.id], data) //* after the mutation is succesful if we open first post then it has to fetch the new post and which takes so inorder to reduce that time we can put the data in the cache in this way. In place of data we can pass a callback function which takes old data in the cache and finally return new data from that callback function.

      queryClient.invalidateQueries(["posts"], { exact: true }) //* exact makes sure that the query which has the exact query key provided will be called. queryClient.invalidateQueries will be called when mutation is successful
      setCurrentPage(<Post id={data.id} />)
    },

    //* onSuccess: (data, variables, context),
    //* onError: (error, variables, context),
    //* onSettled: (data, error, variables, context),
    //* onMutate runs before mutationFn
    onMutate: (variables) => {
      return { hi: "bye" }
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    createPostMutation.mutate({
      title: titleRef.current.value,
      body: bodyRef.current.value,
    })
  }

  return (
    <div>
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input id="body" ref={bodyRef} />
        </div>
        <button disabled={createPostMutation.isLoading}>
          {createPostMutation.isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  )
}
