// Submit user form
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const height = document.getElementById("height").value;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, height })
  });

  const msg = await res.text();n
  alert(msg);
});

// Search for user
document.getElementById("search-btn").addEventListener("click", async () => {
  const name = document.getElementById("search-name").value;

  const res = await fetch(`/api/users/${encodeURIComponent(name)}`);
  const data = await res.json();

  const result = document.getElementById("result");

  if (data.error) {
    result.textContent = data.error;
    result.style.color = "red";
  } else {
    result.textContent = `Name: ${data.name}, Age: ${data.age}, Height: ${data.height} cm`;
    result.style.color = "green";
  }
});