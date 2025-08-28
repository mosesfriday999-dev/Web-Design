// Load posts from localStorage or use default
let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [
  {
    title: "My First Post",
    content: "I built my blog today. It feels amazing!",
    views: 120,
    date: "2025-08-27",
    author: "Moses",
    likes: 0,
    comments: [],
    tags: ["Introduction", "Personal"]
  },
  {
    title: "Why I Love Coding",
    content: "Coding lets me create anything I imagine.",
    views: 200,
    date: "2025-08-26",
    author: "Moses",
    likes: 0,
    comments: [],
    tags: ["Coding", "Passion"]
  }
];

let currentPage = 1;
const postsPerPage = 5;
let sortedPosts = blogPosts.slice();
let currentSort = 'date';
let currentTagFilter = '';

function displayPosts(posts) {
  posts = posts || sortedPosts || blogPosts;
  const container = document.getElementById("blogContainer");
  container.innerHTML = "";
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = posts.slice(start, end);
  paginatedPosts.forEach((post, idx) => {
    const realIdx = start + idx;
    const article = document.createElement("article");
    article.className = "post";
    article.innerHTML = `
      <h2 onclick="incrementViews(${realIdx})" style="cursor:pointer;">${post.title}</h2>
      ${post.image ? `<img src='${post.image}' alt='Post image' style='max-width:100%;border-radius:8px;margin-bottom:10px;'>` : ""}
      <p>${post.content}</p>
      <div class="meta">
        <span>By ${post.author || 'Anonymous'} on ${post.date}</span>
        <span class="tags">Tags: ${(post.tags || []).map(tag => `<span class='tag'>${tag}</span>`).join(', ')}</span>
        <span class="views">Views: ${post.views || 0}</span>
      </div>
      <div class="share">
        <span>Share: </span>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}" target="_blank">Twitter</a> |
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank">Facebook</a>
      </div>
      <button onclick="likePost(${realIdx})">👍 Like (${post.likes})</button>
      <button onclick="editPost(${realIdx})">✏️ Edit</button>
      <button onclick="deletePost(${realIdx})">🗑️ Delete</button>
      <div class="comments">
        <h3>Comments</h3>
        <ul id="comments-${realIdx}">
          ${(post.comments || []).map(comment => `<li>${comment}</li>`).join('')}
        </ul>
        <input type="text" id="comment-input-${realIdx}" placeholder="Add a comment">
        <button onclick="addComment(${realIdx})">Add Comment</button>
      </div>
    `;
    container.appendChild(article);
  });
  renderPagination(posts.length);
}

function renderPagination(totalPosts) {
  const container = document.getElementById("blogContainer");
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  if (totalPages <= 1) return;
  const nav = document.createElement("nav");
  nav.className = "pagination";
  nav.innerHTML = `
    <button ${currentPage === 1 ? 'disabled' : ''} onclick="prevPage()">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? 'disabled' : ''} onclick="nextPage()">Next</button>
  `;
  container.appendChild(nav);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayPosts(blogPosts);
  }
}

function nextPage() {
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPosts(blogPosts);
  }
}

function likePost(idx) {
  blogPosts[idx].likes = (blogPosts[idx].likes || 0) + 1;
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  displayPosts(blogPosts);
}

function addComment(idx) {
  const input = document.getElementById(`comment-input-${idx}`);
  const comment = input.value.trim();
  if (comment) {
    blogPosts[idx].comments = blogPosts[idx].comments || [];
    blogPosts[idx].comments.push(comment);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    displayPosts(blogPosts);
  }
}

function editPost(idx) {
  const post = blogPosts[idx];
  const newTitle = prompt("Edit title:", post.title);
  const newContent = prompt("Edit content:", post.content);
  if (newTitle !== null && newContent !== null) {
    post.title = newTitle;
    post.content = newContent;
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    displayPosts(blogPosts);
  }
}

function deletePost(idx) {
  if (confirm("Are you sure you want to delete this post?")) {
    blogPosts.splice(idx, 1);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    displayPosts(blogPosts);
  }
}

function search() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const filtered = blogPosts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.content.toLowerCase().includes(keyword) ||
    (post.tags || []).some(tag => tag.toLowerCase().includes(keyword))
  );
  displayPosts(filtered);
}

function addPost() {
  const title = document.getElementById("newTitle").value.trim();
  const content = document.getElementById("newContent").value.trim();
  const imageInput = document.getElementById("newImage");
  let imageUrl = "";
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageUrl = e.target.result;
      finishAddPost(title, content, imageUrl);
    };
    reader.readAsDataURL(imageInput.files[0]);
    return;
  }
  finishAddPost(title, content, imageUrl);
}

function finishAddPost(title, content, imageUrl) {
  const tagsInput = prompt("Enter tags separated by commas:");
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
  if (!title || !content) {
    alert("Please enter both a title and content for your post.");
    return;
  }
  const newPost = {
    title: title,
    content: content,
    image: imageUrl,
    views: 0,
    date: new Date().toISOString().slice(0, 10),
    author: "Moses",
    likes: 0,
    comments: [],
    tags: tags
  };
  blogPosts.unshift(newPost);
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  displayPosts(blogPosts);
  document.getElementById("newTitle").value = "";
  document.getElementById("newContent").value = "";
  document.getElementById("newImage").value = "";
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function showHome() {
  document.getElementById('blogContainer').style.display = '';
  document.getElementById('editor').style.display = '';
  document.getElementById('aboutSection').style.display = 'none';
  document.getElementById('contactSection').style.display = 'none';
}

function showAbout() {
  document.getElementById('blogContainer').style.display = 'none';
  document.getElementById('editor').style.display = 'none';
  document.getElementById('aboutSection').style.display = '';
  document.getElementById('contactSection').style.display = 'none';
}

function showContact() {
  document.getElementById('blogContainer').style.display = 'none';
  document.getElementById('editor').style.display = 'none';
  document.getElementById('aboutSection').style.display = 'none';
  document.getElementById('contactSection').style.display = '';
}

function incrementViews(idx) {
  blogPosts[idx].views = (blogPosts[idx].views || 0) + 1;
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  displayPosts(blogPosts);
}

function sortPosts() {
  const sortValue = document.getElementById('sortSelect').value;
  currentSort = sortValue;
  applySortAndFilter();
}

function filterByTag() {
  const tag = document.getElementById('tagFilter').value.trim().toLowerCase();
  currentTagFilter = tag;
  applySortAndFilter();
}

function applySortAndFilter() {
  sortedPosts = blogPosts.slice();
  if (currentTagFilter) {
    sortedPosts = sortedPosts.filter(post => (post.tags || []).some(t => t.toLowerCase().includes(currentTagFilter)));
  }
  if (currentSort === 'date') {
    sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'likes') {
    sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (currentSort === 'views') {
    sortedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  currentPage = 1;
  displayPosts(sortedPosts);
}

// Call applySortAndFilter on page load
applySortAndFilter();
