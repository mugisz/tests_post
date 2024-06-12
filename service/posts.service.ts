
export const PostService = {

    fetchData:  async () => {
        try {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
          );
          return await response.json();
       
        } catch (error) {
          console.error("Error fetching data:", error);
          
        }
      }
}