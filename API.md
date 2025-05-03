## Backend APIs
Here are the currently used APIs from our backend. We recommend the following:
```
- Always keep this list updated as new APIs are added to the application
- It would be best that these apis are posted on a private web page with the application
- It would also be best to have add contact informations in case an API break
```

### APIs
GET <HOST>/yt/a-s
```
INPUT: a YouTube video id
OUTPUT: JSON containing anti-siloing articles
Description: This API queries the best keywords from a YouTube transcript, find anytonyms of these keywords, and query articles from NewsAPI.org using said keywords.
```
GET <HOST>/yt/fc
```
INPUT: a YouTube video id
OUTPUT: JSON containing fact-checked articles 
Description: This API queries the best keywrods from a YouTube transcript, and queries articles from the Google Fact Check Tools API.
```
