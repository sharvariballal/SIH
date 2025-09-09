// Handle Discussion Posts
document.getElementById("discussion-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const input = document.getElementById("discussion-input");
  const posts = document.getElementById("discussion-posts");

  if (input.value.trim() !== "") {
    const newPost = document.createElement("div");
    newPost.classList.add("post");
    newPost.innerHTML = `<strong>You:</strong>${input.value}`;
    posts.appendChild(newPost);
    input.value = ""; // clear input
  }
});

// Handle Member Stories
document.getElementById("story-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const input = document.getElementById("story-input");
  const posts = document.getElementById("story-posts");

  if (input.value.trim() !== "") {
    const newStory = document.createElement("div");
    newStory.classList.add("post");
    newStory.innerHTML = `<strong>You:</strong> ${input.value}`;
    posts.appendChild(newStory);
    input.value = ""; // clear input
  }
});