const hostname = window && window.location && window.location.hostname

let API_HOST

if(hostname === "dashboard.noahtemplet.dev")
  API_HOST = "https://api.noahtemplet.dev"
else
  API_HOST = "http://localhost:5000"

export { API_HOST }