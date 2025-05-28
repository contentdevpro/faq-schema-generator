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

  faqItem.appendChild(questionInput);
  faqItem.appendChild(answerInput);
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

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i].value.trim();
    const a = answers[i].value.trim();

    if (q && a) {
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
