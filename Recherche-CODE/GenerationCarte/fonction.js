function getInformation(indicatorCode, countryCode) {
    const apiUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json`;
  
    const request = new XMLHttpRequest();
    request.open('GET', apiUrl, false);
    request.send();
  
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      const indicatorData = data[1];
  
      const nonNullValues = indicatorData.filter(result => result.value !== null);
  
      if (nonNullValues.length > 0) {
        nonNullValues.sort((a, b) => new Date(b.date) - new Date(a.date));
        const value = nonNullValues[0].value;
        return value;
      } else {
        return null;
      }
    } else {
      console.error('Erreur lors de la récupération des données :', request.status);
      return null;
    }
  }