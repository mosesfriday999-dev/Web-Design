// Load posts from localStorage or use default
let blogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [
  {
    title: "My First Post",
    content: "I built my blog today. It feels amazing!",
    views: 120,
    date: "2025-08-27"
  },
  {
    title: "Why I Love Coding",
    content: "Coding lets me create anything I imagine.",
    views: 200,
    date: "2025-08-26"
  }
];

function savePosts() {
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
}

function displayPosts(posts) {
  const container = document.getElementById("blogContainer");
  container.innerHTML = "";
  posts.forEach(post => {
    const article = document.createElement("article");
    article.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
    container.appendChild(article);
  });
}

function search() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const filtered = blogPosts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.content.toLowerCase().includes(keyword)
  );
  displayPosts(filtered);
}

function addPost() {
  const title = document.getElementById("newTitle").value;
  const content = document.getElementById("newContent").value;

  if (title.trim() === "" || content.trim() === "") {
    alert("Please fill in both title and content.");
    return;
  }

  const newPost = {
    title: title,
    content: content,
    views: 0,
    date: new Date().toISOString().split("T")[0]
  };

  blogPosts.unshift(newPost);
  savePosts(); // Save to localStorage
  displayPosts(blogPosts);

  document.getElementById("newTitle").value = "";
  document.getElementById("newContent").value = "";
}

displayPosts(blogPosts);
