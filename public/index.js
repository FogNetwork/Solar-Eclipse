var search = document.getElementById("search")

search.addEventListener("keyup", function(e) {
  if (e.target.value && e.key == "Enter") {
    e.preventDefault();
    window.location.href = prefix + "gateway?url=" + search.value
    e.target.value = ""
  }
});