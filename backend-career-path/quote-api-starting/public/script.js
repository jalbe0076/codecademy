const fetchAllButton = document.getElementById('fetch-quotes');
const fetchRandomButton = document.getElementById('fetch-random');
const fetchByAuthorButton = document.getElementById('fetch-by-author');

const quoteContainer = document.getElementById('quote-container');
const attributionText = document.querySelector('.attribution');
let updateQuotesBtn;

const createButton = (text, className) => {
  const button = document.createElement('button');
  button.innerText = text;
  button.className = className;
  return button;
};

const createTextArea = (value) => {
  const textArea = document.createElement('textArea');
  textArea.value = value;
  return textArea;
};

const addButtonEventListeners = (okButton, cancelButton, okAction, cancelAction) => {
  okButton.addEventListener('click', okAction);
  cancelButton.addEventListener('click', cancelAction);
};

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
      newQuote.className = 'single-quote';
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">  ${quote.person}</div>`;
      
      const updateButton = createButton('Update', `update-btn-${quote.id} update-btns`);
      const deleteButton = createButton('Delete', `delete-btns`);
      const confirmDeleteText = document.createElement('p');
   
      const quoteText = newQuote.querySelector('.quote-text');
      const authorContainer = newQuote.querySelector('.attribution');
      
      quoteContainer.appendChild(newQuote);
      newQuote.appendChild(updateButton);
      newQuote.appendChild(deleteButton);
      
      updateButton.addEventListener('click', (e) => {
        const newQuoteTextBox = createTextArea(quoteText.innerText);
        const newAuthorTextBox = createTextArea(authorContainer.innerText);

        newQuote.replaceChild(newQuoteTextBox, quoteText);
        newQuote.replaceChild(newAuthorTextBox, authorContainer);

        const okButton = createButton('OK', `ok-btn`);
        const cancelButton = createButton('Cancel', `cancel-btn`);

        addButtonEventListeners(okButton, cancelButton, () => {
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
            };
  
            updateQuote(updatedQuote);
          }, 
          () => {
              newQuote.replaceChild(quoteText, newQuoteTextBox);
              newQuote.replaceChild(authorContainer, newAuthorTextBox);
    
              okButton.replaceWith(updateButton);
              cancelButton.replaceWith(deleteButton);
          }
        );

        updateButton.replaceWith(okButton);
        deleteButton.replaceWith(cancelButton);
      });

      deleteButton.addEventListener('click', () => {
        const okButton = createButton('OK', `ok-btn`);
        const cancelButton = createButton('Cancel', `cancel-btn`);

        confirmDeleteText.innerText = 'Delete quote?'
        updateButton.replaceWith(okButton);
        newQuote.insertBefore(confirmDeleteText, okButton);
        deleteButton.replaceWith(cancelButton);

        addButtonEventListeners(okButton, cancelButton, async () => {
            const indexOfQuote = quotes.findIndex(element => quote.id === element.id);
            if(indexOfQuote !== -1) {
              const deleteMessage = await deleteQuote(quote)
              if(deleteMessage.ok) {
                quotes.splice(indexOfQuote, 1);
                newQuote.remove();
              } else {
                confirmDeleteText.innerText('Cannot delete quote, please try again later')
              }
            }
          }, 
          () => {
            newQuote.removeChild(confirmDeleteText);
            okButton.replaceWith(updateButton);
            cancelButton.replaceWith(deleteButton);
          }
        );
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
};

const deleteQuote = async (quote) => {
  if(JSON.stringify(quote) !== "{}") {
    try {
      const response = await fetch('/api/quotes', {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(quote)
      })
      const data = await handleError(response);

      return data;
    } catch(err) {
      console.log(err.message)
    }
  }
};

const handleError = (response) => {
  if(response.ok) {
    if (response.status === 204) {
      // No response body for a successful deletion (204)
      return { ok: true };
    } else {
      // For other successful responses with a body, parse the JSON
      return response.json();
    }
  } else {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
}
