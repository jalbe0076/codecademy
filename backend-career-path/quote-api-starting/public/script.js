const fetchAllButton = document.getElementById('fetch-quotes');
const fetchRandomButton = document.getElementById('fetch-random');
const fetchByAuthorButton = document.getElementById('fetch-by-author');

const quoteContainer = document.getElementById('quote-container');
// const quoteText = document.querySelector('.quote');
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
      const deleteButton = document.createElement('button');
      const confirmDeleteText = document.createElement('p')
      newQuote.className = 'single-quote';
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">  ${quote.person}</div>`;
      updateButton.className = `update-btn-${quote.id} update-btns`;
      updateButton.innerText = 'Update';
      deleteButton.className = 'delete-btns';
      deleteButton.innerText = 'Delete';
      confirmDeleteText.innerText = 'Delete quote?'
      quoteContainer.appendChild(newQuote);
      newQuote.appendChild(updateButton);
      newQuote.appendChild(deleteButton);
      const quoteText = newQuote.querySelector('.quote-text');
      const authorContainer = newQuote.querySelector('.attribution');
      
      updateButton.addEventListener('click', (e) => {
        const newQuoteTextBox = document.createElement('textArea');
        const newAuthorTextBox = document.createElement('textArea');
        newQuoteTextBox.value = quoteText.innerText;
        newAuthorTextBox.value = authorContainer.innerText;

        newQuote.replaceChild(newQuoteTextBox, quoteText);
        newQuote.replaceChild(newAuthorTextBox, authorContainer);

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';

        okButton.addEventListener('click', () => {
          quoteText.innerText = newQuoteTextBox.value;
          authorContainer.innerText = newAuthorTextBox.value;

          newQuote.replaceChild(quoteText, newQuoteTextBox);
          newQuote.replaceChild(authorContainer, newAuthorTextBox);

          okButton.replaceWith(updateButton);
          cancelButton.replaceWith(deleteButton);

          const updatedQuote = {
            id: quote.id,
            quote: quoteText.innerText,
            person: authorContainer.innerText
          }

          updateQuote(updatedQuote)
        });

        cancelButton.addEventListener('click', () => {
          newQuote.replaceChild(quoteText, newQuoteTextBox);
          newQuote.replaceChild(authorContainer, newAuthorTextBox);

          okButton.replaceWith(updateButton);
          cancelButton.replaceWith(deleteButton);
        })
                
        updateButton.replaceWith(okButton);
        deleteButton.replaceWith(cancelButton);
      });

      deleteButton.addEventListener('click', (e) => {
        const okButton = document.createElement('button');
        okButton.innerText = 'OK';

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';

        updateButton.replaceWith(okButton);
        newQuote.insertBefore(confirmDeleteText, okButton);
        deleteButton.replaceWith(cancelButton);

        okButton.addEventListener('click', (e) => {
          const indexOfQuote = quotes.findIndex(element => quote.id === element.id);
          if(indexOfQuote !== -1) {
            quotes.splice(indexOfQuote, 1);
            newQuote.remove();
          }
        })

        cancelButton.addEventListener('click', () => {
          newQuote.removeChild(confirmDeleteText);
          okButton.replaceWith(updateButton);
          cancelButton.replaceWith(deleteButton);
        })
      });
    });
  } else {
    quoteText.innerHTML = '<p>Your request returned no quotes.</p>';
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
