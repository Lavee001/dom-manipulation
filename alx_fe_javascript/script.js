document.addEventListener("DOMContentLoaded", () => {
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
  ];

  function saveQuotes() {
      localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function showRandomQuote() {
      const filteredQuotes = quotes.filter(q => 
          document.getElementById("categoryFilter").value === "all" ||
          q.category === document.getElementById("categoryFilter").value
      );
      if (filteredQuotes.length === 0) return;
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      document.getElementById("quoteDisplay").innerText = randomQuote.text;
  }

  function addQuote() {
      const text = document.getElementById("newQuoteText").value.trim();
      const category = document.getElementById("newQuoteCategory").value.trim();
      if (text && category) {
          quotes.push({ text, category });
          saveQuotes();
          populateCategories();
          document.getElementById("newQuoteText").value = "";
          document.getElementById("newQuoteCategory").value = "";
          showRandomQuote();
      }
  }

  function populateCategories() {
      const categories = [...new Set(quotes.map(q => q.category))];
      const filter = document.getElementById("categoryFilter");
      filter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
          let option = document.createElement("option");
          option.value = category;
          option.innerText = category;
          filter.appendChild(option);
      });
  }

  function filterQuotes() {
      showRandomQuote();
      localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
  }

  function exportQuotes() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
          try {
              const importedQuotes = JSON.parse(e.target.result);
              if (Array.isArray(importedQuotes)) {
                  quotes.push(...importedQuotes);
                  saveQuotes();
                  populateCategories();
                  alert("Quotes imported successfully!");
              }
          } catch (error) {
              alert("Invalid JSON file.");
          }
      };
      fileReader.readAsText(event.target.files[0]);
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").value = localStorage.getItem("selectedCategory") || "all";
  populateCategories();
  showRandomQuote();
});
