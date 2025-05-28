// Get references to buttons and output
const addFaqBtn = document.getElementById("add-faq");
const generateBtn = document.getElementById("generate-json");
const faqList = document.getElementById("faq-list");
const output = document.getElementById("json-output");

// Function to create a new FAQ input block
function createFaqItem() {
  const faqItem = document.createElement("div");
  faqItem.className = "faq-item";

  const questionInput = document.createElement("input");
  questionInput.type = "text";
  questionInput.placeholder = "Enter your question";
  questionInput.className = "question";

  const answerInput = document.createElement("textarea");
  answerInput.placeholder = "Enter your answer";
  answerInput.className = "answer";

  // 🔘 Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Delete";
  deleteBtn.className = "delete-faq";
  deleteBtn.addEventListener("click", () => {
    faqList.removeChild(faqItem);
  });

  // Append elements
  faqItem.appendChild(questionInput);
  faqItem.appendChild(answerInput);
  faqItem.appendChild(deleteBtn);

  faqList.appendChild(faqItem);
}

// Add first FAQ on page load
createFaqItem();

// Add new FAQ item when button clicked
addFaqBtn.addEventListener("click", createFaqItem);

// Generate JSON when button clicked
generateBtn.addEventListener("click", () => {
  const questions = document.querySelectorAll(".question");
  const answers = document.querySelectorAll(".answer");

  const faqArray = [];

  let hasEmpty = false;
  faqArray.length = 0; // clear old data

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i].value.trim();
    const a = answers[i].value.trim();

    // Reset border styles
    questions[i].style.border = "1px solid #ccc";
    answers[i].style.border = "1px solid #ccc";

    if (!q || !a) {
      hasEmpty = true;
      // Highlight missing input
      if (!q) questions[i].style.border = "2px solid red";
      if (!a) answers[i].style.border = "2px solid red";
    } else {
      faqArray.push({
        "@type": "Question",
        name: q,
        acceptedAnswer: {
          "@type": "Answer",
          text: a,
        },
      });
    }
  }

  // If empty input found, stop here
  if (hasEmpty) {
    console.log("Detected empty question or answer!");
    alert("Please fill in all questions and answers before generating JSON.");
    return;
  }

  if (faqArray.length === 0) {
    alert("You must fill in at least one complete FAQ before generating JSON.");
    return;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqArray,
  };

  output.textContent = JSON.stringify(jsonLd, null, 2);
});

// Copy JSON to clipboard
const copyBtn = document.getElementById("copy-json");

copyBtn.addEventListener("click", () => {
  const jsonText = output.textContent;

  navigator.clipboard
    .writeText(jsonText)
    .then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy to Clipboard";
      }, 1500);
    })
    .catch((err) => {
      alert("Failed to copy text: " + err);
    });
});
const downloadBtn = document.getElementById("download-json");

downloadBtn.addEventListener("click", () => {
  const jsonText = output.textContent;

  if (!jsonText || jsonText.trim() === "{}") {
    alert("Please generate valid JSON first.");
    return;
  }

  const blob = new Blob([jsonText], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "faq-schema.json";
  a.click();

  URL.revokeObjectURL(url); // Clean up memory
});
