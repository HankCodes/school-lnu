// TODO get token from local storage, maybe create wrapper localstorage function for this.
const setheaders = (gitService?: string): HeadersInit => {
    // TODO make a better and moore generic solution for this
    const headers: any = {
        "Content-Type": "application/json"
    }

    const token = localStorage.getItem(gitService + '_token')
    if (token) headers.Authorization = token

    return headers
}

export default setheaders 