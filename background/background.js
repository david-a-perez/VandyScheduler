chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const BASE_URL = 'https://www.ratemyprofessors.com/ShowRatings.jsp?tid=';
	const BASE_SEARCH_URL = 'https://www.ratemyprofessors.com/search/teachers?sid=U2Nob29sLTQwMDI=&query=';
	const method = 'GET';
	const headers = new Headers();
	if (method === 'POST') headers.append('Content-Type', 'application/x-www-form-urlencoded');
	const config = {
		method: method,
		headers: headers,
		mode: 'cors',
		cache: 'default',
	};

	switch (request.action) {
		case 'searchForProfessor':
			fetch(BASE_SEARCH_URL + request.query, config)
				.then(res => res.text())
				.then(pageText => {
					const match1 = pageText.match(/"legacyId":(\d+)/);
					const legacyId = match1 ? match1[1] : match1;
					console.log(legacyId);
					const match2 = pageText.match(/"avgRating":([\d\.]+)/);
					const avgRating = match2 ? match2[1] : match2;
					console.log(avgRating);
					console.log(legacyId + ' = ' + avgRating);
					// const searchPage = document.createElement('html');
					// searchPage.innerHTML = pageText;
					// const profId = searchPage.querySelector('.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1');
					// const ret = (profId) ? profId.getElementsByTagName('a')[0].getAttribute('href') : profId;
					// sendResponse({ profId: ret });
					sendResponse({ profId: legacyId });
				})
				.catch(err => {
					console.log('[ERROR: searchForProfessor]');
					console.log(err);
					sendResponse();
					return false;
				});
			return true;
			break;
		case 'getOverallScore':
			fetch(BASE_URL + request.query, config)
				.then(res => res.text())
				.then(pageText => {
					// Initialize the DOM parser
					const parser = new DOMParser();

					// Parse the text
					const doc = parser.parseFromString(pageText, "text/html");

					// You can now even select part of that html as you would in the regular DOM 
					// Example:
					const profRating = doc.querySelector('div.RatingValue__Numerator-qw8sqy-2').textContent;
					
					// const ratingPage = document.createElement('html');
					// ratingPage.innerHTML = pageText;
					// console.log(ratingPage);
					// const profRating = ratingPage.querySelector('div.RatingValue__Numerator-qw8sqy-2').textContent;
					sendResponse({ profRating });
				})
				.catch(err => {
					console.log('[ERROR: getOverallScore]');
					console.log(err);
					sendResponse();
					return false;
				})
			return true;
			break;
		default:
			console.log(`Action ${request.action} not recognized`);
			break;
  }
});
