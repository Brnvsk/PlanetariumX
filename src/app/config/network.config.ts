export const apiUrl = 'http://localhost:5050' //local
// export const apiUrl = 'https://pleasant-underwear-goat.cyclic.app' //remote

const baseUrl = apiUrl

export const ApiRoutes = {
    users: {
        register: `${baseUrl}/api/users/register`,
        login: `${baseUrl}/api/users/login`,
        toString: () => `${baseUrl}/api/users`,
    },
    news: {
        tags: `${baseUrl}/api/news/tags`,
        toString: () => `${baseUrl}/api/news`,
    },
    shows: {
        timeslots: `${baseUrl}/api/shows/timeslots`,
        toString: () => `${baseUrl}/api/shows`,
    },
    sessions: {
        toString: () => `${baseUrl}/api/sessions`,
    },
    booking: {
        toString: () => `${baseUrl}/api/booking`,
    },
    upload: {
        toString: () => `${baseUrl}/api/upload`,
    }
}