const fetchAllButton = document.getElementById('fetch-quotes');
const fetchRandomButton = document.getElementById('fetch-random');
const fetchByAuthorButton = document.getElementById('fetch-by-author');

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.querySelector('.quote');
const attributionText = document.querySelector('.attribution');
let updateQuotesBtn;

const resetQuotes = () => {
  quoteContainer.innerHTML = '';
}

const renderError = response => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    quotes.forEach(quote => {
      const newQuote = document.createElement('div');
      const updateButton = document.createElement('button');
      newQuote.className = 'single-quote';
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}</div>`;
      updateButton.className = `update-btn-${quote.id} update-btns`;
      updateButton.innerText = 'Update';
      quoteContainer.appendChild(newQuote);
      newQuote.appendChild(updateButton);

      updateButton.addEventListener('click', (e) => {
        const quoteContainer = newQuote.querySelector('.quote-text');
        const authorContainer = newQuote.querySelector('.attribution');

        const newQuoteTextBox = document.createElement('textArea');
        const newAuthorTextBox = document.createElement('textArea');
        newQuoteTextBox.value = quoteContainer.innerText;
        newAuthorTextBox.value = authorContainer.innerText;

        newQuote.replaceChild(newQuoteTextBox, quoteContainer);
        newQuote.replaceChild(newAuthorTextBox, authorContainer);

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';

        okButton.addEventListener('click', () => {
          quoteContainer.innerText = newQuoteTextBox.value;
          authorContainer.innerText = newAuthorTextBox.value;

          newQuote.replaceChild(quoteContainer, newQuoteTextBox);
          newQuote.replaceChild(authorContainer, newAuthorTextBox);

          newQuote.removeChild(okButton);
          newQuote.removeChild(cancelButton);
          newQuote.appendChild(updateButton);

          const updatedQuote = {
            id: quote.id,
            quote: quoteContainer.innerText,
            person: authorContainer.innerText
          }
          
          updadeQuote(updatedQuote)
        });

        cancelButton.addEventListener('click', () => {
          newQuote.replaceChild(quoteContainer, newQuoteTextBox);
          newQuote.replaceChild(authorContainer, newAuthorTextBox);

          newQuote.removeChild(okButton);
          newQuote.removeChild(cancelButton);
          newQuote.appendChild(updateButton);
        })
                
        updateButton.replaceWith(okButton);
        newQuote.appendChild(cancelButton);
      })
    });
  } else {
    quoteContainer.innerHTML = '<p>Your request returned no quotes.</p>';
  }
}

fetchAllButton.addEventListener('click', () => {
  fetch('/api/quotes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes(response);
    
  });
});

fetchRandomButton.addEventListener('click', () => {
  fetch('/api/quotes/random')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes([response]);
  });
});

fetchByAuthorButton.addEventListener('click', () => {
  const author = document.getElementById('author').value;
  fetch(`/api/quotes?person=${author}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderQuotes(response);
  });
});

const updateQuote = async (quote) => {
  if(JSON.stringify(quote) !== "{}") {
    try {
      const response = await fetch('/api/quotes', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(quote)
      })
      const data = await handleError(response);

      return data;
    } catch(err) {
      console.log(err.message)
    }
  }
}

const handleError = (response) => {
  if(response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
}
