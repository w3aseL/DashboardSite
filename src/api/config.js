const hostname = window && window.location && window.location.hostname

let API_HOST

if(hostname === "dashboard.noahtemplet.dev")
  API_HOST = "https://api.noahtemplet.dev"
else if (hostname === "qa.dashboard.noahtemplet.dev")
  API_HOST = "https://qa.api.noahtemplet.dev/api"
else
  API_HOST = "http://localhost:5192/api"

export { API_HOST }