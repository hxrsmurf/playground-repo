package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    string `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type User struct {
	DisplayName string `json:"display_name"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/login", login)
	http.HandleFunc("/callback", callback)
	fmt.Println("http://localhost:8000/login")
	http.ListenAndServe(":8000", nil)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello World!\n")
}

func login(w http.ResponseWriter, r *http.Request) {
	const redirectUri = "http://localhost:8000/callback"
	const spotifyUrl = "https://accounts.spotify.com/authorize?"
	values := url.Values{}
	values.Add("response_type", "code")
	values.Add("client_id", os.Getenv("SPOTIFY_ID"))
	values.Add("scope", "user-read-email")
	values.Add("redirect_uri", redirectUri)
	values.Add("state", "1234")
	queryString := values.Encode()
	url := spotifyUrl + queryString
	http.Redirect(w, r, url, http.StatusFound)
}

func callback(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	code := queryValues.Get("code")

	clientID := os.Getenv("SPOTIFY_ID")
	clientSecret := os.Getenv("SPOTIFY_SECRET")
	redirectURI := "http://localhost:8000/callback"

	authOptions := url.Values{}
	authOptions.Add("code", code)
	authOptions.Add("redirect_uri", redirectURI)
	authOptions.Add("grant_type", "authorization_code")

	// ChatGPT :)

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(authOptions.Encode()))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(clientID+":"+clientSecret)))

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	bytes, _ := io.ReadAll(resp.Body)

	var tokenResponse TokenResponse

	json.Unmarshal(bytes, &tokenResponse)
	accessToken := tokenResponse.AccessToken
	userResp := user(accessToken)
	message := "Welcome " + userResp.DisplayName
	fmt.Fprint(w, message)
}

func user(accessToken string) User {
	url := "https://api.spotify.com/v1/me"
	token := "Bearer " + accessToken

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Set("Authorization", token)

	client := &http.Client{}
	resp, _ := client.Do(req)

	body, _ := ioutil.ReadAll(resp.Body)
	var user User
	json.Unmarshal(body, &user)
	return user
}
