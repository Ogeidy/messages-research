let myHeaders = new Headers();
myHeaders.set('Cache-Control', 'no-store');
let urlParams = new URLSearchParams(window.location.search);
let tokens;
let domain = "messages-auth";
let region = "us-east-2";
let appClientId = "6m69gfa0sagjr83daffh01pmpr";
let userPoolId = "us-east-2_b3PpCB1dP";
let redirectURI = "https://d2fghpynnfycy8.cloudfront.net";


async function log_in() {
    // Create random "state"
    var state = getRandomString();
    sessionStorage.setItem("pkce_state", state);

    // Create PKCE code verifier
    var code_verifier = getRandomString();
    sessionStorage.setItem("code_verifier", code_verifier);

    // Create code challenge
    var arrayHash = await encryptStringWithSHA256(code_verifier);
    var code_challenge = hashToBase64url(arrayHash);
    sessionStorage.setItem("code_challenge", code_challenge)

    // Redirtect user-agent to /authorize endpoint
    location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/oauth2/authorize?response_type=code&state=" + state + "&client_id=" + appClientId + "&redirect_uri=" + redirectURI + "&scope=openid&code_challenge_method=S256&code_challenge=" + code_challenge;
}

function log_out() {
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    // Redirtect user-agent to /logout endpoint
    location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/logout?client_id=" + appClientId + "&logout_uri=" + redirectURI;
}

// Main Function
async function main() {
    var code = urlParams.get('code');

    if (code == null) {
        // Do nothing        
    } else {

        // Verify state matches
        state = urlParams.get('state');
        if (sessionStorage.getItem("pkce_state") != state) {
            alert("Invalid state");
        } else {

            // Fetch OAuth2 tokens from Cognito
            code_verifier = sessionStorage.getItem('code_verifier');
            await fetch("https://" + domain + ".auth." + region + ".amazoncognito.com/oauth2/token?grant_type=authorization_code&client_id=" + appClientId + "&code_verifier=" + code_verifier + "&redirect_uri=" + redirectURI + "&code=" + code, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {

                    // Verify id_token
                    tokens = data;
                    var idVerified = verifyToken(tokens.id_token);
                    Promise.resolve(idVerified).then(function (value) {
                        if (value.localeCompare("verified")) {
                            alert("Invalid ID Token - " + value);
                            return;
                        }
                    });
                    sessionStorage.setItem("id_token", tokens.id_token);
                    sessionStorage.setItem("access_token", tokens.access_token);
                    // Display tokens
                    // document.getElementById("id_token").innerHTML = JSON.stringify(parseJWTPayload(tokens.id_token), null, '\t');
                    // document.getElementById("access_token").innerHTML = JSON.stringify(parseJWTPayload(tokens.access_token), null, '\t');
                    // Redirtect user-agent to redirectURI
                    location.href = redirectURI;
                });


        }
    }

    let access_token = sessionStorage.getItem("access_token")
    if (access_token) {
        // Fetch from /user_info
        await fetch("https://" + domain + ".auth." + region + ".amazoncognito.com/oauth2/userInfo", {
            method: 'post',
            headers: {
                'authorization': 'Bearer ' + access_token
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Display user information
                // document.getElementById("userInfo").innerHTML = JSON.stringify(data, null, '\t');
                document.getElementById("username").innerHTML = 'username: ' + data['username'];
                document.getElementById("email").innerHTML = 'email: ' + data['email'];
            });
    }
}
main();