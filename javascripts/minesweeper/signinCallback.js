function signinCallback(authResult) {
      console.log(authResult);
  if (authResult.status.signed_in) {
    document.getElementById("googleSignIn").style.display = "none";
    userSignedIn = true;

    gapi.client.load("games","v1",function(response) {
      googleServiceReady = true;
    });
  }
}
