import { isDev, apiBaseUrl, p } from 'helpers';

export async function submitIssue(title, body, label, autoGenerated) {
  if(!isDev() || !autoGenerated) {
    var success = await fetch(apiBaseUrl() + 'github/submitIssue/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        label,
        autoGenerated
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.type === "success") {
        p("Successfully packaged and sent bug to development team!")
        return true;
      }
      else {
        p("Error in response from github when sending bug to development team!")
        return false;
      }
    })
    .catch((error) => {
      p("Error in request when trying to send bug to development team!")
      p(error)
      return false;
    });
    return success;
  }
  
}